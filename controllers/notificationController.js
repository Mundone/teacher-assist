const notificationService = require("../services/notificationService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getNotificationsController = async (req, res, next) => {
  try {
    const { pageNo, pageSize, sortBy, sortOrder } = req.pagination;

    const userId = req.user && req.user.id;
    const filters = [
      {
        fieldName: "user_id",
        operation: "eq",
        value: userId,
      },
    ];

    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };


    const { totalObjects, objects } = await notificationService.getNotificationsService(
      queryOptions
    );
    res.json({
      pagination: {
        current_page_no: pageNo + 1,
        total_pages: Math.ceil(totalObjects / pageSize),
        per_page: pageSize,
        total_elements: totalObjects,
      },
      data: objects,
    });
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
    const objects = await notificationService.createNotificationService(
      req.body,
      userId
    );
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
