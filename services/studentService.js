// services/studentService.js
const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getAllStudents = async ({
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
              include: [
                {
                  model: allModels.Subject,
                  attributes: ["id", "user_id"],
                  where: { id: subjectId },
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

const getStudentById = async (id) => {
  return await allModels.Student.findByPk(id);
};

const createStudent = async (data, subjectScheduleId) => {
  const isUserIncludeSchedule = await allModels.SubjectSchedule.findOne({
    where: { id: subjectScheduleId },
  }).then((ss) => {
    if (ss != null) {
      return true;
    }
    return false;
  });

  if (!isUserIncludeSchedule) {
    const error = new Error("Зөвшөөрөлгүй хандалт");
    error.statusCode = 403;
    throw error;
  }

  const createdStudentObject = await allModels.Student.create(data);

  await allModels.StudentSubjectSchedule.create({
    student_id: createdStudentObject.id,
    subject_schedule_id: subjectScheduleId,
  });

  const subjectScheduleObject = await allModels.SubjectSchedule.findByPk(
    subjectScheduleId
  );

  const lessonAssessmentObjects = await allModels.LessonAssessment.findAll({
    where: { lesson_type_id: subjectScheduleObject.lesson_type_id },
  });

  const lessonAssessmentIds = lessonAssessmentObjects.map(
    (lessonAssessment) => lessonAssessment.dataValues.id
  );

  const lessonObjects = await allModels.Lesson.findAll({
    where: {
      subject_id: subjectScheduleObject.subject_id,
      lesson_assessment_id: {
        [Sequelize.Op.in]: lessonAssessmentIds, // Using the IN operator to check the existence
      },
    },
  });

  for (const lessonObject of lessonObjects) {
    await allModels.Grade.create({
      student_id: createdStudentObject.id,
      lesson_id: lessonObject.id,
      grade: 0,
    });
  }

  return createdStudentObject;
};

const createStudentBulkService = async (data, subjectScheduleId) => {
  console.log(subjectScheduleId);

  const isUserIncludeSchedule = await allModels.SubjectSchedule.findOne({
    where: { id: subjectScheduleId },
  }).then((ss) => {
    if (ss != null) {
      return true;
    }
    return false;
  });

  if (!isUserIncludeSchedule) {
    const error = new Error("Зөвшөөрөлгүй хандалт");
    error.statusCode = 403;
    throw error;
  }

  const newObjects = await allModels.Student.bulkCreate(data);

  for (const newObject of newObjects) {
    await allModels.StudentSubjectSchedule.create({
      student_id: newObject.id,
      subject_schedule_id: subjectScheduleId,
    });
  }

  return newObjects;
};

const updateStudent = async (id, data) => {
  const student = await allModels.Student.findByPk(id);
  if (student) {
    return await student.update(data);
  }
  return null;
};

const deleteStudent = async (id) => {
  const student = await allModels.Student.findByPk(id);
  if (student) {
    await student.destroy();
    return true;
  }
  return false;
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
  getAllStudents,
  getStudentById,
  createStudent,
  createStudentBulkService,
  updateStudent,
  deleteStudent,
};
