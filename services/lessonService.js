// subjectService.js
const allModels = require("../models");

// const getAllLessons = async ({
//   where,
//   limit,
//   offset,
//   order,
//   userId,
//   subjectId,
//   isWithoutBody,
// }) => {
//   await checkIfUserCorrect(subjectId, userId);

//   if (isWithoutBody) {
//     return await allModels.Lesson.findAll({
//       attributes: [
//         "id",
//         "subject_id",
//         "lesson_assessment_id",
//         "week_number",
//         "lesson_number",
//       ],
//       include: [
//         {
//           model: allModels.LessonAssessment,
//           attributes: [
//             "id",
//             "lesson_assessment_code",
//             "lesson_assessment_description",
//             "lesson_type_id",
//           ],
//         },
//         {
//           model: allModels.Subject,
//           attributes: ["id", "user_id"],
//           where: { id: subjectId },
//         },
//       ],
//     });
//   }

//   let { count: totalLessons, rows: lessons } =
//     await allModels.Lesson.findAndCountAll({
//       include: [
//         {
//           model: allModels.LessonAssessment,
//           attributes: [
//             "id",
//             "lesson_assessment_code",
//             "lesson_assessment_description",
//             "lesson_type_id",
//           ],
//         },
//         {
//           model: allModels.Subject,
//           attributes: ["id", "user_id"],
//           where: { id: subjectId },
//         },
//       ],
//       attributes: [
//         "id",
//         "subject_id",
//         "lesson_assessment_id",
//         "week_number",
//         "lesson_number",
//       ],

//       where: where, // Use the where options built from filters
//       limit: limit,
//       offset: offset,
//       order: order,
//       distinct: true,
//     });

//   return {
//     totalLessons,
//     lessons,
//   };
// };

// const getLessonById = async (id, userId) => {
//   const returnObject = await allModels.Lesson.findByPk(id, {
//     include: [
//       {
//         model: allModels.LessonAssessment,
//         attributes: [
//           "id",
//           "lesson_assessment_code",
//           "lesson_assessment_description",
//           "lesson_type_id",
//         ],
//       },
//       {
//         model: allModels.Subject,
//         attributes: ["id", "user_id"],
//       },
//     ],
//     attributes: [
//       "id",
//       "subject_id",
//       "lesson_assessment_id",
//       "week_number",
//       "lesson_number",
//     ],
//   });

//   await checkIfUserCorrect(returnObject.subject_id, userId);
//   return returnObject;
// };

// const createLesson = async (lessonData, userId) => {
//   const returnObject = await allModels.Lesson.findByPk(lessonData.subject_id);
//   await checkIfUserCorrect(returnObject.subject_id, userId);
//   return await allModels.Lesson.create(lessonData);
// };

// const updateLesson = async (id, lessonData, userId) => {
//   const returnObject = await allModels.Lesson.findByPk(id);
//   await checkIfUserCorrect(returnObject.subject_id, userId);
//   return await allModels.Lesson.update(lessonData, {
//     where: { id: id },
//   });
// };

// const deleteLesson = async (id, userId) => {
//   const returnObject = await allModels.Lesson.findByPk(id);
//   await checkIfUserCorrect(returnObject.subject_id, userId);
//   return await allModels.Lesson.destroy({
//     where: { id: id },
//   });
// };

const getAllLessons = async ({
  where,
  limit,
  offset,
  order,
  userId,
  subjectId,
  isWithoutBody,
}) => {
  // await checkIfUserCorrect(subjectId, userId);

  if (isWithoutBody) {
    return await allModels.SubjectLessonType.findAll({
      attributes: [
        "id",
        "subject_id",
        "lesson_type_id",
        "lesson_count",
        "max_score",
      ],
      include: [
        {
          model: allModels.Subject,
          attributes: [
            "id",
            "subject_name",
            "subject_code",
            "is_started",
            "user_id",
          ],
          where: { id: subjectId },
        },
        {
          model: allModels.LessonType,
          attributes: ["id", "lesson_type_name"],
        },
      ],
    });
  }

  let { count: totalLessons, rows: lessons } =
    await allModels.SubjectLessonType.findAndCountAll({
      attributes: [
        "id",
        "subject_id",
        "lesson_type_id",
        "lesson_count",
        "max_score",
      ],
      include: [
        {
          model: allModels.Subject,
          attributes: [
            "id",
            "subject_name",
            "subject_code",
            "is_started",
            "user_id",
          ],
          where: { id: subjectId },
        },
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
    totalLessons,
    lessons,
  };
};

const getLessonById = async (id, userId) => {
  const returnObject = await allModels.SubjectLessonType.findByPk(id, {
    attributes: [
      "id",
      "subject_id",
      "lesson_type_id",
      "lesson_count",
      "max_score",
    ],
    include: [
      {
        model: allModels.Subject,
        attributes: [
          "id",
          "subject_name",
          "subject_code",
          "is_started",
          "user_id",
        ],
        where: { id: subjectId },
      },
      {
        model: allModels.LessonType,
        attributes: ["id", "lesson_type_name"],
      },
    ],
  });

  await checkIfUserCorrect(returnObject.subject_id, userId);
  return returnObject;
};

const createLesson = async (lessonData, userId) => {
  const returnObject = await allModels.SubjectLessonType.findByPk(
    lessonData.subject_id
  );
  await checkIfUserCorrect(returnObject.subject_id, userId);
  return await allModels.SubjectLessonType.create(lessonData);
};

const updateLesson = async (id, lessonData, userId) => {
  const returnObject = await allModels.SubjectLessonType.findByPk(id);
  await checkIfUserCorrect(returnObject.subject_id, userId);
  return await allModels.SubjectLessonType.update(lessonData, {
    where: { id: id },
  });
};

const deleteLesson = async (id, userId) => {
  const returnObject = await allModels.SubjectLessonType.findByPk(id);
  await checkIfUserCorrect(returnObject.subject_id, userId);
  return await allModels.SubjectLessonType.destroy({
    where: { id: id },
  });
};

async function checkIfUserCorrect(subjectId, userId) {
  const isUserCorrect = await allModels.SubjectLessonType.findOne({
    include: [
      {
        model: allModels.Subject,
        attributes: ["id", "user_id"],
        where: { id: subjectId, user_id: userId },
      },
    ],
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
