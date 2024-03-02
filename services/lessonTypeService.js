const LessonType = require('../models/lessonType');

const getAllLessonTypes = async () => {
  return await LessonType.findAll();
};

module.exports = {
  getAllLessonTypes,
};
