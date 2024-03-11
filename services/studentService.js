// services/studentService.js
const allModels = require("../models");

const getAllStudents = async ({
  where,
  limit,
  offset,
  order,
  userId,
  subjectScheduleId,
}) => {
  const isUserIncludeSchedule = await allModels.SubjectSchedule.findOne({
    where: { id: subjectScheduleId },

  }).then((ss) => {
    if(ss != null){
      return true;
    }
    return false;
  });

  if (!isUserIncludeSchedule) {
    const error = new Error("Зөвшөөрөлгүй хандалт.");
    error.statusCode = 403;
    throw error;
  }

  let { count: totalStudents, rows: students } =
    await allModels.Student.findAndCountAll({
      include: [
        {
          model: allModels.StudentSubjectSchedule,
          attributes: ["id", "subject_schedule_id"],
          where: { id: subjectScheduleId },
          include: [
            {
              model: allModels.SubjectSchedule,
              attributes: ["id", "subject_id"],
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
  return await Student.findByPk(id);
};

const createStudent = async (data) => {
  return await Student.create(data);
};

const updateStudent = async (id, data) => {
  const student = await Student.findByPk(id);
  if (student) {
    return await student.update(data);
  }
  return null;
};

const deleteStudent = async (id) => {
  const student = await Student.findByPk(id);
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
  updateStudent,
  deleteStudent,
};
