const LectureSchedule = require('../models/lectureSchedule');

const getAllLectureSchedules = async () => {
  return await LectureSchedule.findAll();
};

module.exports = {
  getAllLectureSchedules,
};
