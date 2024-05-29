const axios = require("axios");
const allModels = require("../models");
const { Sequelize } = require("sequelize");

const ONE_SIGNAL_APP_ID = "f7d56879-56e5-4fa3-a790-6b26543742ca";
const REST_API_KEY = "ZTZkYjk4ZDQtYTQ1Ni00MWE1LWIzZTItNjk2ZGU1YWQ4YzY0";
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  Authorization: `Basic ${REST_API_KEY}`,
};

function sendNotificationWhenCreateStudentService(data, subjectObject) {
  let body = {};
  if (data?.playerId) {
    body = {
      app_id: ONE_SIGNAL_APP_ID,
      contents: {
        en:
          "Таныг " +
          subjectObject?.subject?.subject_name +
          " хичээлд амжилттай нэмлээ. Сайн сураарай.",
      },
      headings: { en: "Таныг хичээлд нэмлээ." },
      // included_segments: ["All"],
      include_subscription_ids: [data?.playerId],
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
    include: [
      {
        model: allModels.Subject,
      },
    ],
  });
};

const createNotificationService = async (body, userId) => {
  const { title, text, notification_date, subject_id } = body;

  const transaction = await allModels.sequelize.transaction();

  try {
    if (notification_date == null) {
      notification_date = new Date();
    }
    const notif = await allModels.Notification.create(
      {
        title,
        notification_text: text,
        notification_date,
        subject_id,
        user_id: userId,
      },
      { transaction }
    );

    await transaction.commit();

    const thatStudents = await allModels.Student.findAll({
      include: [
        {
          model: allModels.StudentSubjectSchedule,
          include: [
            {
              model: allModels.SubjectSchedule,
              where: { subject_id: subject_id },
            },
          ],
        },
      ],
    });

    const include_player_ids = thatStudents?.reduce((acc, thatStudent) => {
      if (thatStudent?.player_id) {
        acc.push(thatStudent.player_id);
      }
      return acc;
    }, []);
    
    

    let body = {};
    if (include_player_ids != []) {
      body = {
        app_id: ONE_SIGNAL_APP_ID,
        contents: {
          en: text,
        },
        headings: { en: title },
        // included_segments: ["All"],
        include_subscription_ids: include_player_ids,
      };

      console.log(body);

      return axios
        .post("https://onesignal.com/api/v1/notifications", body, { headers })
        .then((response) => response.data);
    } else {
      return notif;
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getNotificationsService,
  createNotificationService,
  sendNotificationWhenCreateStudentService,
};
