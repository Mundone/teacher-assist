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

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET_VALUE,
      // callbackURL: "http://localhost:3000/auth/microsoft/callback",
      callbackURL: "https://api.teachas.online/auth/microsoft/callback",
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
          // console.log(accessToken)
          updateUser.teams_auth_token = accessToken;
          await updateUser.save();
        }

        const response = await fetch(
          "https://graph.microsoft.com/v1.0/me/photos/48x48/$value",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch profile image");
        }
        
        console.log("start: xxxxxx")
        console.log(response)
        console.log("end: xxxxxxx")

        const imageArrayBuffer = await response.arrayBuffer(); // Use arrayBuffer() instead of buffer()
        const imageBuffer = Buffer.from(imageArrayBuffer); // Convert ArrayBuffer to Buffer
        const base64Image = imageBuffer.toString("base64");

        console.log(base64Image.length);

        try {
          updateUser.profile_image = base64Image;
          await updateUser.save();
          console.log("Profile image saved successfully.");
        } catch (error) {
          console.error("Error saving profile image:", error);
          throw error; // Rethrow the error to handle it at a higher level
        }



        const { user, token, UserMenus } =
          await authService.authenticateUserService({
            email: profile?.emails[0]?.value,
            isDirect: true,
          });

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

app.get(
  "/auth/microsoft",
  passport.authenticate("microsoft"),
  async (req, res) => {
    try {
    } catch (error) {
      if (error.statusCode == 403) {
        responses.forbidden(res, error);
      } else {
        responses.internalServerError(res, error);
      }
    }
  }
);

app.get(
  "/auth/microsoft/callback",
  passport.authenticate("microsoft"),
  async (req, res) => {
    try {
      const authUser = req.user;

      const { user, token, UserMenus } =
        await authService.authenticateUserService({
          email: authUser?.email,
          isDirect: true,
        });

      // res.redirect(`https://teachas.online?token=${token}`);
      res.redirect(`http://localhost:3032?token=${token}`);
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
