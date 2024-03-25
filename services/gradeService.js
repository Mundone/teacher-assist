const allModels = require("../models");

const getAllStudentGrades = async ({
  where,
  limit,
  offset,
  order,
  userId,
  subjectId,
}) => {
  const isUserIncludeSubject = await allModels.Subject.findOne({
    where: { id: subjectId, user_id: userId },
  });

  if (!isUserIncludeSubject) {
    const error = new Error("Зөвшөөрөлгүй хандалт.");
    error.statusCode = 403;
    throw error;
  }

  let { count: totalGrades, rows: grades } =
    await allModels.Student.findAndCountAll({
      include: [
        {
          model: allModels.Grade,
          attributes: ["id", "grade"],

          include: {
            model: allModels.Lesson,
            attributes: [
              "lesson_assessment_id",
              "week_number",
              "createdAt",
              "lesson_number",
            ],
            where: { subject_id: subjectId },
            include: [
              {
                model: allModels.LessonAssessment,
                attributes: ["lesson_type_id", "lesson_assessment_code"],
                include: {
                  model: allModels.LessonType,
                  attributes: ["id", "lesson_type_name"],
                },
              },
            ],
          },

          order: [["id", "asc"]],
        },
      ],
      attributes: ["name", "student_code"],

      where: { subject_id: subjectId },

      where: where,
      limit: limit,
      offset: offset,
      order: [["student_code", "asc"]],
      distinct: true,
    });

  return {
    totalGrades,
    grades,
  };
};

// await allModels.Lesson.findAndCountAll({
//   include: [
//     {
//       model: allModels.Grade,
//       attributes: ["id", "grade"],

//       include: {
//         model: allModels.Student,
//         attributes: ["name", "student_code"],
//       },
//     },
//     {
//       model: allModels.LessonAssessment,
//       attributes: ["lesson_type_id", "lesson_assessment_code"],
//       include: {
//         model: allModels.LessonType,
//         attributes: ["id", "lesson_type_name"],
//       },
//     },
//   ],
//   attributes: ["lesson_assessment_id", "week_number", "createdAt"],

//   where: { subject_id: subjectId },

//   where: where,
//   limit: limit,
//   offset: offset,
//   order: order,
//   distinct: true,
// });

// return {
// totalGrades,
// grades,
// };
// };

// await allModels.Student.findAndCountAll({
//   include: [
//     {
//       model: allModels.Grade,
//       attributes: [
//         // "id",
//         // "student_id",
//         //  "lesson_id",
//         "grade",
//       ],

//       include: {
//         model: allModels.Lesson,
//         attributes: [
//           // "id",
//           // "subject_id",
//           "lesson_assessment_id",
//           "week_number",
//           // "lesson_number",
//           "createdAt",
//           // "lesson_type_id",
//         ],
//         include: {
//           model: allModels.LessonAssessment,
//           attributes: ["lesson_type_id"],
//           include: {
//             model: allModels.LessonType,
//             attributes: ["id", "lesson_type_name"],
//           },
//         },
//         where: { subject_id: subjectId },

//       },
//     },
//   ],
//   attributes: ["id", "name", "student_code", "createdAt"],

//   where: where,
//   limit: limit,
//   offset: offset,
//   order: order,
//   distinct: true,
// });

// await allModels.Grade.findAndCountAll({
//   include: [
//     {
//       model: allModels.Student,
//       attributes: ["id", "name", "student_code", "createdAt"],
//     },
//     {
//       model: allModels.Lesson,
//       attributes: [
//         "id",
//         "subject_id",
//         "lesson_assessment_id",
//         "week_number",
//         "lesson_number",
//         "createdAt",
//         "lesson_type_id",
//       ],
//       where: { subject_id: subjectId },
//     },
//   ],
//   attributes: ["id", "student_id", "lesson_id", "grade"],

//   where: where,
//   limit: limit,
//   offset: offset,
//   order: order,
//   distinct: true,
// });

const updateGrade = async (id, data, userId, isFromAttendance) => {
  const gradeObject = await allModels.Grade.findByPk(id, {
    include: [
      {
        model: allModels.Lesson,
        attributes: ["subject_id"],
        include: {
          model: allModels.Subject,
          attributes: ["id"],
        },
      },
    ],
    attributes: ["lesson_id"],
  });
  const subjectId = gradeObject.lesson.subject.id;

  if (!isFromAttendance) {
    const isUserIncludeGrade = await allModels.Subject.findOne({
      where: { id: subjectId, user_id: userId },
    });

    if (!isUserIncludeGrade) {
      const error = new Error("Зөвшөөрөлгүй хандалт.");
      error.statusCode = 403;
      throw error;
    }
  }

  const currentModel = await allModels.Grade.findByPk(id);
  if (currentModel) {
    return await currentModel.update(data);
  }
  return null;
};

module.exports = {
  getAllStudentGrades,
  updateGrade,
};
