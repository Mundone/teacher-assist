const allModels = require("../models");

const getAllSchedulesService = async () => {
  return await allModels.Schedule.findAll({
    attributes: ["id", "schedule_name", "schedule_day", "schedule_time"],
  });
};

module.exports = {
  getAllSchedulesService,
};
