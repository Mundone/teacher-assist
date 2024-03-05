// subjectService.js
const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getAllLessons = async (pageNo, pageSize, sortBy, sortOrder) => {
  const offset = pageNo * pageSize;
  const { count: totalLessons, rows: lessons } = await allModels.Lesson.findAndCountAll({
    include: [
      {
        model: allModels.LessonAssessment,
        attributes: ["id", "lesson_assessment_code", "lesson_assessment_description", "lesson_type_id"],
      },
    ],
    attributes: ["id", "subject_id", "lesson_assessment_id", "week_number", "lesson_number"],
    limit: pageSize,
    offset: offset,
    order: [[sortBy, sortOrder]],
  });

  return {
    totalLessons, // This will be a single number
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
