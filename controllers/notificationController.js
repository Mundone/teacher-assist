const notificationService = require("../services/notificationService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getNotificationsController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const filters = [
      {
        fieldName: "user_id",
        operation: "eq",
        value: userId,
      },
    ];

    const objects = await notificationService.getNotificationsService({
      where: buildWhereOptions(filters),
    });
    res.json(objects);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const createNotificationController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const objects = await notificationService.createNotificationService(req.body, userId);
    responses.created(res, objects);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getNotificationsController,
  createNotificationController,
};
