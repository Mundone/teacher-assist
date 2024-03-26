const scheduleService = require("../services/scheduleService");
const responses = require("../utils/responseUtil");

const getScheduleController = async (req, res, next) => {
  try {
    const objects = await scheduleService.getAllSchedulesService();
    res.json(objects);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getScheduleController,
};
