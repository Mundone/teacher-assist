const axios = require("axios");
const allModels = require("../models");
const { Sequelize } = require("sequelize");

const ONE_SIGNAL_APP_ID = "f7d56879-56e5-4fa3-a790-6b26543742ca";
const REST_API_KEY = "ZTZkYjk4ZDQtYTQ1Ni00MWE1LWIzZTItNjk2ZGU1YWQ4YzY0";
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  Authorization: `Basic ${REST_API_KEY}`,
};

function sendNotificationService(data, subjectObject) {
  let body = {};
  if (data?.playerId) {
    body = {
      app_id: ONE_SIGNAL_APP_ID,
      contents: {
        en:
          "Таныг " +
          subjectObject?.subject?.subject_name +
          " хичээлд амжилттай нэмлээ.",
      },
      headings: { en: "Сайн байна уу." },
      included_segments: ["All"],
      // include_player_ids: [data.playerId],
    };

    return axios
      .post("https://onesignal.com/api/v1/notifications", body, { headers })
      .then((response) => response.data);
  } else {
    return true;
  }
}

const getNotificationsService = async ({ where }) => {
  return await allModels.Notification.findAll({
    // attributes: ["id", "notif_title", "description"],
    where: where,
  });
};

const createNotificationService = async (body, userId) => {
  const { title, text, notification_date, subject_id } = body;

  const transaction = await allModels.sequelize.transaction();

  try {
    if(notification_date == null){
      notification_date = new Date();
    }
    const notif = await allModels.Notification.create(
      {
        title,
        text,
        notification_date,
        subject_id,
        user_id: userId,
      },
      { transaction }
    );

    await transaction.commit();
    return notif;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  sendNotificationService,
  getNotificationsService,
  createNotificationService,
};
