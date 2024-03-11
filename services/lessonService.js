// subjectService.js
const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getAllLessons = async ({ where, limit, offset, order, userId }) => {

  let { count: totalLessons, rows: lessons } =
    await allModels.Lesson.findAndCountAll({
      include: [
        {
          model: allModels.LessonAssessment,
          attributes: ["id", "lesson_assessment_code", "lesson_assessment_description", "lesson_type_id"],
        },
        {
          model: allModels.Subject,
          attributes: ["id", "user_id"],
          where: { user_id: userId },
        },
      ],
      attributes: ["id", "subject_id", "lesson_assessment_id", "week_number", "lesson_number"],

      where: where, // Use the where options built from filters
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

  return {
    totalLessons,
    lessons,
  };
};

const createLesson = async (lessonData) => {
  return await Lesson.create(lessonData);
};

const updateLesson = async (id, lessonData) => {
  return await Lesson.update(lessonData, {
    where: { id: id },
  });
};

const getLessonById = async (id) => {
  return await Lesson.findByPk(id);
};

const deleteLesson = async (id) => {
  return await Lesson.destroy({
    where: { id: id },
  });
};

module.exports = {
  getAllLessons,
  createLesson,
  updateLesson,
  getLessonById,
  deleteLesson,
};
