const LabSchedule = require('../models/labSchedule');

const getAllLabSchedules = async () => {
  return await LabSchedule.findAll();
};

module.exports = {
  getAllLabSchedules,
};
