const allModels = require("../models");

const getAllLessonAssessments = async ({
  where,
  limit,
  offset,
  order,
  isWithoutBody,
}) => {
  if (isWithoutBody) {
    return await allModels.LessonAssessment.findAll({
      attributes: [
        "id",
        "lesson_assessment_code",
        "lesson_assessment_description",
        "lesson_type_id",
      ],
      include: [
        {
          model: allModels.LessonType,
          attributes: ["id", "lesson_type_name"],
        },
      ],
    });
  }

  const { count: totalLessonAssessments, rows: lessonAssessments } =
    await allModels.LessonAssessment.findAndCountAll({
      attributes: [
        "id",
        "lesson_assessment_code",
        "lesson_assessment_description",
        "lesson_type_id",
      ],
      include: [
        {
          model: allModels.LessonType,
          attributes: ["id", "lesson_type_name"],
        },
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
  const currentModel = await allModels.LessonAssessment.findByPk(id);
  if (currentModel) {
    return await currentModel.update(data);
  }
  return null;
};

const deleteLessonAssessment = async (id) => {
  const currentModel = await allModels.LessonAssessment.findByPk(id);
  if (currentModel) {
    await currentModel.destroy();
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
