// services/studentService.js
const allModels = require("../models");

const getAllStudents = async ({
  where,
  limit,
  offset,
  order,
  // userId,
  subjectScheduleId,
  // isWithoutBody,
}) => {
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

  // if (isWithoutBody) {
  //   return await allModels.Student.findAll({
  //     attributes: ["id", "name", "student_code", "createdAt"],
  //     include: [
  //       {
  //         model: allModels.StudentSubjectSchedule,
  //         attributes: ["id", "subject_schedule_id"],
  //         where: { id: subjectScheduleId },
  //       },
  //     ],
  //   });
  // }

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
                // "subject_id"
              ],
              where: { id: subjectScheduleId },
              include: [
                {
                  model: allModels.Subject,
                  attributes: ["id", "user_id"],
                  // where: { user_id: userId }
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

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  createStudentBulkService,
  updateStudent,
  deleteStudent,
};
