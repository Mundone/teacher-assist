const settingsService = require("../services/settingsService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const { internalServerError } = require("../utils/responseUtil");

const getCurrentWeekController = async (req, res, next) => {
  try {
    const objectData = await settingsService.getCurrentWeekService();
    res.json(objectData);
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  getCurrentWeekController,
};
