const allModels = require("../models");

const getAllSubjects = async ({
  where,
  limit,
  offset,
  order,
  isWithoutBody,
}) => {
  if (isWithoutBody) {
    return await allModels.Subject.findAll({
      attributes: ["id", "subject_name", "createdAt"],
      where: where,
      include: [
        {
          model: allModels.SubjectLessonType,
          attributes: ["lesson_type_id"],
          include: [
            {
              model: allModels.LessonType,
              attributes: ["lesson_type_name"],
            },
          ],
        },
        {
          model: allModels.SubjectSchedule,
          attributes: ["lesson_type_id"],
          include: [
            {
              model: allModels.StudentSubjectSchedule,
              attributes: [
                "id",
                "student_id",
                "subject_schedule_id",
                "createdAt",
              ],
              include: [
                {
                  model: allModels.Student,
                },
              ],
            },
            {
              model: allModels.LessonType,
              attributes: ["id", "lesson_type_name"],
            },
          ],
          attributes: [
            "id",
            "subject_id",
            "lesson_type_id",
            "lecture_day",
            "lecture_time",
            "createdAt",
          ],
        },
      ],
    });
  }

  let { count: totalSubjects, rows: subjects } =
    await allModels.Subject.findAndCountAll({
      include: [
        {
          model: allModels.SubjectLessonType,
          attributes: ["lesson_type_id"],
          include: [
            {
              model: allModels.LessonType,
              attributes: ["lesson_type_name"],
            },
          ],
        },
        {
          model: allModels.SubjectSchedule,
          attributes: ["lesson_type_id"],
          include: [
            {
              model: allModels.Subject,
              attributes: ["id", "subject_name"],
            },
            {
              model: allModels.LessonType,
              attributes: ["id", "lesson_type_name"],
            },
          ],
          attributes: [
            "id",
            "subject_id",
            "lesson_type_id",
            "lecture_day",
            "lecture_time",
            "createdAt",
          ],
        },
      ],
      attributes: ["id", "subject_name", "createdAt"],
      where: where,
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

  return {
    totalSubjects,
    subjects,
  };
};

// const getAllSubjects = async ({
//   where,
//   limit,
//   offset,
//   order,
//   isWithoutBody,
// }) => {
//   if (isWithoutBody) {
//     return await allModels.Subject.findAll({
//       attributes: [
//         "id", 
//         "subject_name", 
//         "createdAt",
//         [Sequelize.fn("COUNT", Sequelize.col("subject_schedules.student_subject_schedules.student_id")), "studentCount"]
//       ],
//       include: [{
//         model: allModels.SubjectSchedule,
//         attributes: [],
//         include: [{
//           model: allModels.StudentSubjectSchedule,
//           attributes: []
//         }]
//       }],
//       group: ["subject.id", "subject_schedules.id"],
//       raw: true,
//     });
    
//   }

//   let { count: totalSubjects, rows: subjects } =
//     await allModels.Subject.findAndCountAll({
//       attributes: [
//         "id", 
//         "subject_name", 
//         "createdAt",
//         [Sequelize.fn("COUNT", Sequelize.col("subject_schedules.student_subject_schedules.student_id")), "studentCount"]
//       ],
//       include: [{
//         model: allModels.SubjectSchedule,
//         attributes: [],
//         include: [{
//           model: allModels.StudentSubjectSchedule,
//           attributes: [
//           ],
//         }]
//       }],
//       group: ["subject.id", "subject_schedules.id"],
//       raw: true,
//       where: where,
//       // limit: limit,
//       offset: offset,
//       order: order,
//       distinct: true,
//     });

//   return {
//     totalSubjects,
//     subjects,
//   };
// };

const getSubjectById = async (id, userId) => {
  await checkIfUserCorrect(id, userId);
  return await allModels.Subject.findByPk(id, {
    attributes: ["id", "subject_name", "createdAt"],
  });
};

const createSubject = async (data, user_id) => {
  return await allModels.Subject.create({ ...data, user_id });
};

const updateSubject = async (id, data, userId) => {
  await checkIfUserCorrect(id, userId);
  return await allModels.Subject.update(data, {
    where: { id: id },
  });
};

const deleteSubject = async (id, userId) => {
  await checkIfUserCorrect(id, userId);
  return await allModels.Subject.destroy({
    where: { id: id },
  });
};

async function checkIfUserCorrect(id, userId) {
  const isUserCorrect = await allModels.Subject.findOne({
    where: { id: id, user_id: userId },
  });

  if (!isUserCorrect) {
    const error = new Error("Зөвшөөрөлгүй хандалт.");
    error.statusCode = 403;
    throw error;
    
  }
}

module.exports = {
  getAllSubjects,
  createSubject,
  updateSubject,
  getSubjectById,
  deleteSubject,
};
