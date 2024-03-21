// subjectService.js
const allModels = require("../models");

const getAllLessons = async ({
  where,
  limit,
  offset,
  order,
  userId,
  subjectId,
  isWithoutBody,
}) => {
  await checkIfUserCorrect(subjectId, userId);

  if (isWithoutBody) {
    return await allModels.Lesson.findAll({
      attributes: [
        "id",
        "subject_id",
        "lesson_assessment_id",
        "week_number",
        "lesson_number",
      ],
      include: [
        {
          model: allModels.LessonAssessment,
          attributes: [
            "id",
            "lesson_assessment_code",
            "lesson_assessment_description",
            "lesson_type_id",
          ],
        },
        {
          model: allModels.Subject,
          attributes: ["id", "user_id"],
          where: { id: subjectId },
        },
      ],
    });
  }

  let { count: totalLessons, rows: lessons } =
    await allModels.Lesson.findAndCountAll({
      include: [
        {
          model: allModels.LessonAssessment,
          attributes: [
            "id",
            "lesson_assessment_code",
            "lesson_assessment_description",
            "lesson_type_id",
          ],
        },
        {
          model: allModels.Subject,
          attributes: ["id", "user_id"],
          where: { id: subjectId },
        },
      ],
      attributes: [
        "id",
        "subject_id",
        "lesson_assessment_id",
        "week_number",
        "lesson_number",
      ],

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

const getLessonById = async (id, userId) => {
  const returnObject = await allModels.Lesson.findByPk(id, {
    include: [
      {
        model: allModels.LessonAssessment,
        attributes: [
          "id",
          "lesson_assessment_code",
          "lesson_assessment_description",
          "lesson_type_id",
        ],
      },
      {
        model: allModels.Subject,
        attributes: ["id", "user_id"],
      },
    ],
    attributes: [
      "id",
      "subject_id",
      "lesson_assessment_id",
      "week_number",
      "lesson_number",
    ],
  });

  await checkIfUserCorrect(returnObject.subject_id, userId);
  return returnObject;
};

const createLesson = async (lessonData, userId) => {
  const returnObject = await allModels.Lesson.findByPk(lessonData.subject_id);
  await checkIfUserCorrect(returnObject.subject_id, userId);
  return await allModels.Lesson.create(lessonData);
};

const updateLesson = async (id, lessonData, userId) => {
  const returnObject = await allModels.Lesson.findByPk(id);
  await checkIfUserCorrect(returnObject.subject_id, userId);
  return await allModels.Lesson.update(lessonData, {
    where: { id: id },
  });
};

const deleteLesson = async (id, userId) => {
  const returnObject = await allModels.Lesson.findByPk(id);
  await checkIfUserCorrect(returnObject.subject_id, userId);
  return await allModels.Lesson.destroy({
    where: { id: id },
  });
};

async function checkIfUserCorrect(subjectId, userId) {
  const isUserCorrect = await allModels.Subject.findOne({
    where: { id: subjectId, user_id: userId },
  });

  if (!isUserCorrect) {
    const error = new Error("Зөвшөөрөлгүй хандалт.");
    error.statusCode = 403;
    throw error;
  }
}

module.exports = {
  getAllLessons,
  createLesson,
  updateLesson,
  getLessonById,
  deleteLesson,
};
