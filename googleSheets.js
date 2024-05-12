const fs = require("fs");
const { google } = require("googleapis");
const axios = require("axios");

const service = google.sheets("v4");
const credentials = require("./config/credentials.json");

const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
);

async function fetchGoogleSheetData() {
    try {
        const token = await authClient.authorize();
        authClient.setCredentials(token);

        const res = await service.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId: "1W_lENz6XrXcU86PfiELquBSYzcjLrzGs8DI8OOyG7MA",
            range: "A:B",
        });

        const answers = [];
        const rows = res.data.values;

        if (rows.length) {
            rows.shift();

            for (const row of rows) {
                answers.push({ timeStamp: row[0], answer: row[1] });
            }
        } else {
            console.log("No data found.");
        }

        fs.writeFileSync("answers.json", JSON.stringify(answers));
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function createGoogleForm(formTitle, questions) {
    try {
        
    console.log({
        formTitle: formTitle,
        questions: JSON.stringify(questions)
    })
        const response = await axios.post(
            "https://script.google.com/macros/s/AKfycbzplKp1ERAIEo_RTYweAT4m6pkwWxZnRto6Z46UTmgKFAv-KxEp7WFlC9abaaC3-Mc/exec",
            {
                formTitle: formTitle,
                questions: JSON.stringify(questions)
            }
        );
        // console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error creating Google Form:", error);
        throw error;
    }
}

module.exports = { fetchGoogleSheetData, createGoogleForm };
