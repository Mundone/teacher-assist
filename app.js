// app.js

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const logger = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const cors = require("cors");
const { methodCheckMiddleware } = require("./middlewares/authMiddleware");
const { fetchGoogleSheetData } = require("./googleSheets"); // Import the function from googleSheets.js
require("dotenv").config();
require("./config/passport-setup");

const app = express();

// Middlewares
app.use(cors());
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

// Fetch Google Sheet Data
fetchGoogleSheetData()
    .then(() => {
        console.log("Google Sheet data fetched successfully.");
    })
    .catch((error) => {
        console.error("Error fetching Google Sheet data:", error);
    });

module.exports = app;
