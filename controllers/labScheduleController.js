const LabScheduleService = require('../services/labScheduleService');

exports.getLabSchedules = async (req, res, next) => {
  try {
    const labSchedules = await LabScheduleService.getAllLabSchedules();
    res.json(labSchedules);
  } catch (error) {
    next(error);
  }
};
