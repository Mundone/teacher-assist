// googleSheets.js

// Import dependencies
const fs = require("fs");
const { google } = require("googleapis");

const service = google.sheets("v4");
const credentials = require("./config/credentials.json");

// Configure auth client
const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
);

async function fetchGoogleSheetData() {
    try {
        // Authorize the client
        const token = await authClient.authorize();

        // Set the client credentials
        authClient.setCredentials(token);

        // Get the rows
        const res = await service.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId: "1W_lENz6XrXcU86PfiELquBSYzcjLrzGs8DI8OOyG7MA", // Updated spreadsheet ID
            range: "A:B",
        });
        

        // All of the answers
        const answers = [];

        // Set rows to equal the rows
        const rows = res.data.values;

        // Check if we have any data and if we do add it to our answers array
        if (rows.length) {
            // Remove the headers
            rows.shift();

            // For each row
            for (const row of rows) {
                answers.push({ timeStamp: row[0], answer: row[1] });
            }
        } else {
            console.log("No data found.");
        }

        // Save the answers
        fs.writeFileSync("answers.json", JSON.stringify(answers));
    } catch (error) {
        // Log the error
        console.log(error);
        throw error;
    }
}

module.exports = { fetchGoogleSheetData };
