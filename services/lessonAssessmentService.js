const allModels = require("../models");

const getAllLessonAssessments = async ({ where, limit, offset, order }) => {

  console.log(where);

  const { count: totalLessonAssessments, rows: lessonAssessments } =
    await allModels.LessonAssessment.findAndCountAll({
      attributes: [
        "id",
        "lesson_assessment_code",
        "lesson_assessment_description",
        "lesson_type_id",
      ],
      where: where, // Use the where options built from filters
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });
  return {
    totalLessonAssessments, // This will be a single number
    lessonAssessments,
  };
};

const getLessonAssessmentById = async (id) => {
  return await allModels.LessonAssessment.findByPk(id);
};

const createLessonAssessment = async (data) => {
  return await allModels.LessonAssessment.create(data);
};

const updateLessonAssessment = async (id, data) => {
  const lessonAssessment = await allModels.LessonAssessment.findByPk(id);
  if (lessonAssessment) {
    return await lessonAssessment.update(data);
  }
  return null;
};

const deleteLessonAssessment = async (id) => {
  const lessonAssessment = await allModels.LessonAssessment.findByPk(id);
  if (lessonAssessment) {
    await lessonAssessment.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllLessonAssessments,
  getLessonAssessmentById,
  createLessonAssessment,
  updateLessonAssessment,
  deleteLessonAssessment,
};
