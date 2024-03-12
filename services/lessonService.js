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
  const isUserIncludeSchedule = await allModels.Subject.findOne({
    where: { id: subjectId },
  }).then((ss) => {
    if (ss != null) {
      return true;
    }
    return false;
  });

  if (!isUserIncludeSchedule) {
    const error = new Error("Зөвшөөрөлгүй хандалт.");
    error.statusCode = 403;
    throw error;
  }

  // if (isWithoutBody) {
  //   return await allModels.Lesson.findAll({
  //     attributes: [
  //       "id",
  //       "subject_id",
  //       "lesson_assessment_id",
  //       "week_number",
  //       "lesson_number",
  //     ],
  //   });
  // }

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

const getLessonById = async (id) => {
  return await allModels.Lesson.findByPk(id);
};

const createLesson = async (lessonData) => {
  return await allModels.Lesson.create(lessonData);
};

const updateLesson = async (id, lessonData) => {
  return await allModels.Lesson.update(lessonData, {
    where: { id: id },
  });
};

const deleteLesson = async (id) => {
  return await allModels.Lesson.destroy({
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
