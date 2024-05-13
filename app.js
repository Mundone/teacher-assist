// app.js

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const logger = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const flash = require("connect-flash");
const cors = require("cors");
const { methodCheckMiddleware } = require("./middlewares/authMiddleware");
const { fetchGoogleSheetData, createGoogleForm } = require("./googleSheets"); // Import the function from googleSheets.js
require("dotenv").config();
require("./config/passport-setup");
const authService = require("./services/authService");
const axios = require("axios");
const allModels = require("./models");
const responses = require("./utils/responseUtil");

const app = express();

// Middlewares
app.use(cors({ origin: true })); // Enable CORS with dynamic origin
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Swagger UI
const swaggerDocument = require("./swagger/swaggerConfig.js");
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routers
const indexRouter = require("./routes/index.routes");
app.use(methodCheckMiddleware);
app.use("/", indexRouter);

// fetchGoogleSheetData()
//   .then(() => {
//     console.log("Google Sheet data fetched successfully.");
//     // Example form creation
//     const formTitle = "Test Form";
//     const questions = [
//       { question: "What is your name?", type: "short answer" },
//       {
//         question: "How satisfied are you with the product?",
//         type: "multiple choice",
//         options: [
//           "Very satisfied",
//           "Satisfied",
//           "Neutral",
//           "Dissatisfied",
//           "Very dissatisfied",
//         ],
//       },
//     ];
//     return createGoogleForm(formTitle, questions);
//   })
//   .then((formUrl) => {
//     console.log("Google Form created successfully:", formUrl);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

// Configure Microsoft authentication strategy
passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET_VALUE,
      callbackURL: "http://localhost:3000/auth/microsoft/callback",
      // callbackURL: "http://localhost:3032/",
      scope: ["user.read", "openid", "profile", "email"],
      authorizationURL:
        "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      tokenURL: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      tenant: "common",
      session: false,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let updateUser = await allModels.User.findOne({
          where: { email: profile?.emails[0]?.value },
        });

        if (updateUser) {
          updateUser.name = profile.displayName;
          await updateUser.save();
        }

        const { user, token, UserMenus } =
          await authService.authenticateUserService({
            email: profile?.emails[0]?.value,
            isDirect: true,
          });

        console.log("hahah", UserMenus);
        done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// const corsOptions = {
//   origin: 'http://localhost:3032',
//   methods: 'GET, POST, OPTIONS',
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));

app.get('/auth/microsoft', (req, res) => {
  const redirectUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize' +
    '?prompt=select_account' +
    '&response_type=code' +
    '&redirect_uri=http://localhost:3000/auth/microsoft/callback' + // Callback URL on your backend
    '&scope=user.read%20openid%20profile%20email' +
    '&client_id=' + process.env.CLIENT_ID;
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3032'); // Allow CORS from http://localhost:3032

  res.redirect(redirectUrl);
});

app.get(
  "/auth/microsoft/callback",
  passport.authenticate("microsoft"),
  async (req, res) => {
    try {
      console.log(res);

      const authUser = req.user;

      const { user, token, UserMenus } =
      await authService.authenticateUserService({
        email: authUser.email,
        isDirect: true,
      });
      
      return res.redirect('http://localhost:3032/auth-success?user=' + JSON.stringify({ user, token, UserMenus }));

    } catch (error) {
      if (error.statusCode == 403) {
        responses.forbidden(res, error);
      } else {
        responses.internalServerError(res, error);
      }
    }
  }
);


const printMicrosoftForms = async (accessToken) => {
  try {
    const response = await axios.get(
      "https://graph.microsoft.com/v1.0/me/drive/root/search(q='*.microsoftforms')",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const forms = response.data.value.map((form) => form.name);
    //   console.log("Microsoft Forms:", forms);
  } catch (error) {
    // console.error("Error fetching Microsoft Forms:", error.response.data.error);
    throw error;
  }
};

app.get("/.well-known/microsoft-identity-association.json", (req, res) => {
  // Define the content of the microsoft-identity-association.json file
  const microsoftIdentityAssociation = {
    associatedApplications: [
      {
        applicationId: "81c67076-9db8-401b-b0f1-0fc46b20f778",
      },
    ],
  };
  // Set response header to indicate JSON content
  res.setHeader("Content-Type", "application/json");

  // Send the JSON object as response
  res.json(microsoftIdentityAssociation);
});

module.exports = app;
