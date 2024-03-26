// services/studentService.js
const allModels = require("../models");

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
          attributes: [
            "id",
            // "subject_schedule_id"
          ],
          include: [
            {
              model: allModels.SubjectSchedule,
              attributes: [
                "id",
                // "lecture_day",
                // "lecture_time"
                // "subject_id"
              ],
              where: { id: subjectScheduleId },
              include: [
                {
                  model: allModels.Subject,
                  attributes: ["id", "user_id"],
                  // where: { user_id: userId }
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

  const newObject = await allModels.Student.create(data);

  await allModels.StudentSubjectSchedule.create({
    student_id: newObject.id,
    subject_schedule_id: subjectScheduleId,
  });

  return newObject;
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
