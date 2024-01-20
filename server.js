const app = require("./app"); // Adjust the path as necessary if app.js is in a different directory
const sequelize = require("./db").sequelize; // Adjust the path as necessary

const port = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
