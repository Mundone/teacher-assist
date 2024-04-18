const allModels = require("../models");
const { Sequelize } = require("sequelize");

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
        "default_grade",
        "lesson_assessment_sort",
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
        "default_grade",
        "lesson_assessment_sort",
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

const getDefaultConvertGradesBySubjectService = async (subjectId, data) => {
  let subjectSchedules = await allModels.SubjectSchedule.findAll({
    include: [
      {
        model: allModels.Subject,
        where: { id: subjectId },
      },
    ],
  });

  const thatSubjectsLessonTypes = await allModels.LessonType.findAll({
    where: {
      id: {
        [Sequelize.Op.in]: subjectSchedules.map((data) => data.lesson_type_id),
      },
    },
  });
  console.log(thatSubjectsLessonTypes);

  return await allModels.LessonAssessment.findAll({
    attributes: [
      "id",
      "lesson_assessment_code",
      "lesson_assessment_description",
      "default_grade",
      "lesson_type_id",
      "lesson_assessment_sort",
    ],
    where: {
      lesson_type_id: {
        [Sequelize.Op.in]: thatSubjectsLessonTypes.map((data) => data.id),
      },
    },

    order: [["lesson_assessment_sort", "asc"]],
  });
};

module.exports = {
  getAllLessonAssessments,
  getLessonAssessmentById,
  createLessonAssessment,
  updateLessonAssessment,
  deleteLessonAssessment,
  getDefaultConvertGradesBySubjectService,
};
