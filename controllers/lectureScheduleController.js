const LectureScheduleService = require('../services/lectureScheduleService');

exports.getLectureSchedules = async (req, res, next) => {
  try {
    const lectureSchedules = await LectureScheduleService.getAllLectureSchedules();
    res.json(lectureSchedules);
  } catch (error) {
    next(error);
  }
};
