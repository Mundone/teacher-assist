const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getAllSubjects = async ({
  where,
  limit,
  offset,
  order,
  isWithoutBody,
}) => {
  if (isWithoutBody) {
    return await allModels.Subject.findAll({
      attributes: [
        "id",
        "subject_name",
        "subject_code",
        "createdAt",
        [
          Sequelize.literal(`(
          SELECT COUNT(DISTINCT student.id)
          FROM student_subject_schedule
          JOIN student ON student.id = student_subject_schedule.student_id
          JOIN subject_schedule ON subject_schedule.id = student_subject_schedule.subject_schedule_id
          WHERE subject_schedule.subject_id = subject.id
        )`),
          "student_count",
        ],
      ],
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
            {
              model: allModels.Schedule,
            },
          ],
          attributes: [
            "id",
            "subject_id",
            "lesson_type_id",
            // "lecture_day",
            // "lecture_time",
            "createdAt",
          ],
        },
      ],
    });
  }

  let { count: totalSubjects, rows: subjects } =
    await allModels.Subject.findAndCountAll({
      attributes: [
        "id",
        "subject_name",
        "subject_code",
        "createdAt",
        [
          Sequelize.literal(`(
        SELECT COUNT(DISTINCT student.id)
        FROM student_subject_schedule
        JOIN student ON student.id = student_subject_schedule.student_id
        JOIN subject_schedule ON subject_schedule.id = student_subject_schedule.subject_schedule_id
        WHERE subject_schedule.subject_id = subject.id
      )`),
          "student_count",
        ],
      ],
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
            // "lecture_day",
            // "lecture_time",
            "createdAt",
          ],
        },
      ],
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
    attributes: ["id", "subject_name", "subject_code", "createdAt"],
  });
};

const createSubject = async (data, user_id) => {
  const subjectObject = await allModels.Subject.create({
    subject_name: data.subject_name,
    subject_code: data.subject_code,
    user_id,
  });

  let subjectSchedulesToCreate = [];
  let lessonsToCreate = [];

  for (const subject_schedule of data.subject_schedules) {
    await allModels.SubjectLessonType.create({
      subject_id: subjectObject.id,
      lesson_type_id: subject_schedule.lesson_type_id,
    });
    for (const schedule_id of subject_schedule.schedule_ids) {
      subjectSchedulesToCreate.push({
        subject_id: subjectObject.id,
        lesson_type_id: subject_schedule.lesson_type_id,
        schedule_id,
      });
    }

    const lessonAssessmentObjects = await allModels.LessonAssessment.findAll({
      where: { lesson_type_id: subject_schedule.lesson_type_id },
    });

    for (const lessonAssessmentObject of lessonAssessmentObjects) {
      for (let i = 0; i < 16; i++) {
        lessonsToCreate.push({
          subject_id: subjectObject.id,
          lesson_assessment_id: lessonAssessmentObject.id,
          week_number: i + 1,
          lesson_number: i + 1,
        });
      }
    }
  }

  await allModels.SubjectSchedule.bulkCreate(subjectSchedulesToCreate);

  if (lessonsToCreate.length > 0) {
    await allModels.Lesson.bulkCreate(lessonsToCreate);
  }

  return subjectObject;
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
