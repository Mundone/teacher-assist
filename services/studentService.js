// services/studentService.js
const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getAllStudentsService = async ({
  where,
  limit,
  offset,
  order,
  userId,
  subjectId,
  // isWithoutBody,
}) => {
  await checkIfUserCorrect(subjectId, userId);

  let { count: totalStudents, rows: students } =
    await allModels.Student.findAndCountAll({
      include: [
        {
          model: allModels.StudentSubjectSchedule,
          attributes: ["id"],
          include: [
            {
              model: allModels.SubjectSchedule,
              attributes: ["id"],
              where: { subject_id: subjectId },
              include: [
                {
                  model: allModels.Subject,
                  attributes: ["id", "teacher_user_id"],
                },
                {
                  model: allModels.Schedule,
                },
              ],
            },
          ],
        },
      ],
      attributes: ["id", "name", "student_code", "createdAt"],

      where: where,
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

  return {
    totalStudents,
    students,
  };
};

const getStudentByIdService = async (id) => {
  return await allModels.Student.findByPk(id);
};

// const isUserIncludeSchedule = await allModels.SubjectSchedule.findOne({
//   where: { id: subjectScheduleId },
// }).then((ss) => {
//   if (ss != null) {
//     return true;
//   }
//   return false;
// });

// if (!isUserIncludeSchedule) {
//   const error = new Error("Зөвшөөрөлгүй хандалт");
//   error.statusCode = 403;
//   throw error;
// }

// const lessonAssessmentObjects = await allModels.LessonAssessment.findAll({
//   where: { lesson_type_id: subjectScheduleObject.lesson_type_id },
// });

// const lessonAssessmentIds = lessonAssessmentObjects.map(
//   (lessonAssessment) => lessonAssessment.dataValues.id
// );

// const subjectScheduleObject = await allModels.SubjectSchedule.findByPk(
//   subjectScheduleId
// );

//subjectScheduleId ni unendee subject shuu
const createStudentService = async (data, subjectScheduleId, userId) => {
  // Start a transaction
  const transaction = await allModels.sequelize.transaction();

  try {
    const subjectObject = await allModels.SubjectSchedule.findOne(
      {
        include: [
          {
            model: allModels.Subject,
            where: { teacher_user_id: userId },
          },
        ],
        where: { id: subjectScheduleId },
      },
      { transaction }
    );

    if (!subjectObject) {
      const error = new Error("Зөвшөөрөлгүй хандалт");
      error.statusCode = 403;
      throw error;
    }

    const createdStudentObject = await allModels.Student.create(data, {
      transaction,
    });

    subjectScheduleObjects = await allModels.SubjectSchedule.findAll(
      {
        where: { subject_id: subjectObject?.subject_id },
      },
      { transaction }
    );

    const studentSubjectScheduleData = subjectScheduleObjects.map(
      (subjectScheduleObject) => ({
        student_id: createdStudentObject.id,
        subject_schedule_id: subjectScheduleObject.id,
      })
    );

    await allModels.StudentSubjectSchedule.bulkCreate(
      studentSubjectScheduleData,
      { transaction }
    );

    const lessonObjects = await allModels.Lesson.findAll(
      {
        where: {
          subject_id: subjectObject?.subject_id,
        },
      },
      { transaction }
    );

    console.log(subjectObject)

    const gradeData = lessonObjects.map((lessonObject) => ({
      student_id: createdStudentObject.id,
      lesson_id: lessonObject.id,
      grade: 0,
    }));

    await allModels.Grade.bulkCreate(gradeData, { transaction });

    // Commit the transaction
    await transaction.commit();

    return createdStudentObject;
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    throw error;
  }
};

const createStudentBulkService = async (studentData, subjectScheduleId) => {
  // console.log(subjectScheduleId);

  const transaction = await allModels.sequelize.transaction();

  try {
    const subjectSchedule = await allModels.SubjectSchedule.findOne(
      {
        where: { id: subjectScheduleId },
      },
      { transaction }
    );

    if (!subjectSchedule) {
      const error = new Error("Зөвшөөрөлгүй хандалт");
      error.statusCode = 403;
      throw error;
    }

    const students = await allModels.Student.bulkCreate(studentData, {
      transaction,
    });
    const studentIds = students.map((student) => student.id);

    const studentSubjectSchedules = studentIds.map((studentId) => ({
      student_id: studentId,
      subject_schedule_id: subjectScheduleId,
    }));

    await allModels.StudentSubjectSchedule.bulkCreate(studentSubjectSchedules, {
      transaction,
    });

    const lessonObjects = await allModels.Lesson.findAll(
      {
        where: { subject_id: subjectSchedule.subject_id },
      },
      { transaction }
    );

    const grades = lessonObjects.reduce((acc, lesson) => {
      const lessonGrades = studentIds.map((studentId) => ({
        student_id: studentId,
        lesson_id: lesson.id,
        grade: 0,
      }));
      return acc.concat(lessonGrades);
    }, []);

    await allModels.Grade.bulkCreate(grades, { transaction });

    await transaction.commit();
    return students;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateStudentService = async (id, data) => {
  const student = await allModels.Student.findByPk(id);
  if (student) {
    return await student.update(data);
  }
  return null;
};

const deleteStudentService = async (id) => {
  const student = await allModels.Student.findByPk(id);
  if (student) {
    await student.destroy();
    return true;
  }
  return false;
};

async function checkIfUserCorrect(id, userId) {
  console.log(id);
  console.log(userId);
  const isUserCorrect = await allModels.Subject.findOne({
    where: { id: id, teacher_user_id: userId },
  });

  if (!isUserCorrect) {
    const error = new Error("Зөвшөөрөлгүй хандалт.");
    error.statusCode = 403;
    throw error;
  }
}

module.exports = {
  getAllStudentsService,
  getStudentByIdService,
  createStudentService,
  createStudentBulkService,
  updateStudentService,
  deleteStudentService,
};
