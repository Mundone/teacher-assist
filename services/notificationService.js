const axios = require('axios');

const ONE_SIGNAL_APP_ID = "f7d56879-56e5-4fa3-a790-6b26543742ca";
const REST_API_KEY = "ZTZkYjk4ZDQtYTQ1Ni00MWE1LWIzZTItNjk2ZGU1YWQ4YzY0";
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  Authorization: `Basic ${REST_API_KEY}`,
};

function sendNotificationService(data, subjectObject) {
  const body = {
    app_id: ONE_SIGNAL_APP_ID,
    contents: { en: "Таныг " + subjectObject?.subject?.subject_name + " хичээлд амжилттай нэмлээ." },
    headings: { en: "Сайн уу хэхахах." },
    // included_segments: ["All"]
    include_player_ids: [data.playerId]
  };

  return axios.post("https://onesignal.com/api/v1/notifications", body, { headers })
    .then(response => response.data);
}

module.exports = {
  sendNotificationService,
};
