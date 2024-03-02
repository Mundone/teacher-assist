const LessonTypeService = require('../services/lessonTypeService');

const getLessonTypes = async (req, res, next) => {
  try {
    const lessonTypes = await LessonTypeService.getAllLessonTypes();
    res.json(lessonTypes);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getLessonTypes
};