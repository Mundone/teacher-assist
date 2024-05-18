// services/studentService.js
const allModels = require("../models");
const { Sequelize } = require("sequelize");
const { profileUrl } = require("../config/const");

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
const createStudentService = async (data, subjectScheduleIds, userId) => {
  // Start a transaction
  const transaction = await allModels.sequelize.transaction();

  try {
    // Check for existing SubjectSchedule with the given ID and teacher_user_id
    const subjectObject = await allModels.SubjectSchedule.findOne(
      {
        include: [
          {
            model: allModels.Subject,
            where: { teacher_user_id: userId },
          },
        ],
        where: { id: subjectScheduleIds[0] },
      },
      { transaction }
    );

    if (!subjectObject) {
      const error = new Error("Зөвшөөрөлгүй хандалт");
      error.statusCode = 403;
      throw error;
    }

    // Check if the student already exists by student_code
    const existingStudentObject = await allModels.Student.findOne(
      {
        where: { student_code: data.student_code },
      },
      { transaction }
    );

    let studentObject;

    if (existingStudentObject) {
      existingStudentObject.update(
        {
          where: { name: data.name },
        },
        { transaction }
      );
      studentObject = existingStudentObject;
    } else {
      // Create a new student if one does not exist
      studentObject = await allModels.Student.create(
        // { ...data, profile_image: profileUrl + data.student_code },
        { ...data },
        { transaction }
      );
    }

    // Retrieve all SubjectSchedules associated with the subject_id
    // const subjectScheduleObjects = await allModels.SubjectSchedule.findAll(
    //   {
    //     where: { subject_id: subjectObject.subject_id },
    //   },
    //   { transaction }
    // );

    // Prepare data for linking student with subject schedules
    const studentSubjectScheduleData = subjectScheduleIds.map((ss) => ({
      student_id: studentObject.id,
      subject_schedule_id: ss,
    }));

    // Link student to subject schedules
    await allModels.StudentSubjectSchedule.bulkCreate(
      studentSubjectScheduleData,
      { transaction }
    );

    // Retrieve all lessons associated with the subject_id
    const lessonObjects = await allModels.Lesson.findAll(
      {
        where: { subject_id: subjectObject.subject_id },
      },
      { transaction }
    );

    // Prepare initial grade data for the student for each lesson
    const gradeData = lessonObjects.map((lesson) => ({
      student_id: studentObject.id,
      lesson_id: lesson.id,
      grade: 0, // Assume initial grade is set to 0
    }));

    // Create initial grades for the student
    await allModels.Grade.bulkCreate(gradeData, { transaction });

    // Commit the transaction
    await transaction.commit();

    return studentObject; // Return the student object (new or existing)
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    throw error;
  }
};

const createStudentBulkService = async (studentData, subjectScheduleId) => {
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

    // Check and create/update students
    const studentPromises = studentData.map(async (data) => {
      const [student, created] = await allModels.Student.findOrCreate({
        where: { student_code: data.student_code },
        defaults: data,
        transaction,
      });
      return student;
    });

    const students = await Promise.all(studentPromises);
    const studentIds = students.map((student) => student.id);

    // Link students to the subject schedule
    const studentSubjectSchedules = studentIds.map((studentId) => ({
      student_id: studentId,
      subject_schedule_id: subjectScheduleId,
    }));

    await allModels.StudentSubjectSchedule.bulkCreate(studentSubjectSchedules, {
      transaction,
    });

    // Retrieve lessons associated with the subject
    const lessonObjects = await allModels.Lesson.findAll(
      {
        where: { subject_id: subjectSchedule.subject_id },
      },
      { transaction }
    );

    // Prepare grades data
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
