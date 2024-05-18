const fetch = require('node-fetch');

const ONE_SIGNAL_APP_ID = 'f7d56879-56e5-4fa3-a790-6b26543742ca';
const REST_API_KEY = 'ZTZkYjk4ZDQtYTQ1Ni00MWE1LWIzZTItNjk2ZGU1YWQ4YzY0';
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Authorization": `Basic ${REST_API_KEY}`
};

function sendNotificationService(data) {
  const body = {
    app_id: ONE_SIGNAL_APP_ID,
    contents: { "en": "Notification body" },
    headings: { "en": "Notification title" },
    // include_player_ids: [data.playerId]
  };

  return fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })
  .then(response => response.json());
}

module.exports = {
    sendNotificationService,
  };
  