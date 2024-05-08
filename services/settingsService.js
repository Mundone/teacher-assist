const allModels = require("../models");
const { Sequelize } = require("sequelize");
const { execFile } = require("child_process");
const { resetDBFunction } = require("../migrate");

const getCurrentWeekService = async () => {
  const exist = await allModels.Semester.findOne();

  if (!exist) {
    throw new Error("Семистер үүсгээгүй байна.", { statusCode: 404 });
  }

  var weekCount = 0;

  const activeSemester = await allModels.Semester.findOne({
    where: {
      is_active: true,
    },
  });

  if (!activeSemester) {
    throw new Error("Семистер эхлээгүй байна.", { statusCode: 400 });
  } else {
    await allModels.Semester.findOne({
      where: {
        is_active: true,
      },
    }).then((obj) => {
      // const dateString = "2024-01-24T00:00:00.000Z";
      const dateString = obj.start_date.toString();
      const targetDate = new Date(dateString);
      const currentDate = new Date();
      const diffInMilliseconds = targetDate - currentDate;
      const diffInWeeks = diffInMilliseconds / (1000 * 60 * 60 * 24 * 7);
      weekCount = Math.abs(Math.round(diffInWeeks));
    });
  }

  const semesters = await allModels.Semester.findAll({
    attributes: ["id", "semester_code"],
  });
  var semester = semesters[0].toJSON();
  semester.weekNumber = weekCount + 1;

  return {
    semester,
  };
};

const getAllSemestersService = async ({ where, limit, offset, order }) => {
  let { count: totalObjects, rows: objects } =
    await allModels.Semester.findAndCountAll({
      attributes: [
        "id",
        "semester_code",
        "start_date",
        "is_active",
        // "user_id",
        "createdAt",
      ],
      include: {
        model: allModels.User,
        attributes: ["id", "name", "email", "code"],
      },

      where: where,
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

  return {
    totalObjects,
    objects,
  };
};

const getSemesterByIdService = async (id) => {
  return await allModels.Semester.findByPk(id);
};

const createSemesterService = async (objectData, user_id) => {
  return await allModels.Semester.create({
    ...objectData,
    admin_user_id: user_id,
  });
};

const updateSemesterService = async (id, objectData) => {
  return await allModels.Semester.update(objectData, {
    where: { id: id },
  });
};

const deleteSemesterService = async (id) => {
  return await allModels.Semester.destroy({
    where: { id: id },
  });
};

const getCurrentWeekFunction = async () => {
  const exist = await allModels.Semester.findOne();

  if (!exist) {
    throw new Error("Семистер үүсгээгүй байна.", { statusCode: 404 });
  }

  var weekCount = 0;

  const activeSemester = await allModels.Semester.findOne({
    where: {
      is_active: true,
    },
  });

  if (!activeSemester) {
    throw new Error("Семистер эхлээгүй байна.", { statusCode: 400 });
  } else {
    const obj = await allModels.Semester.findOne({
      where: {
        is_active: true,
      },
    });

    const dateString = obj.start_date.toString();
    const targetDate = new Date(dateString);
    const currentDate = new Date();
    const diffInMilliseconds = targetDate - currentDate;
    const diffInWeeks = diffInMilliseconds / (1000 * 60 * 60 * 24 * 7);
    weekCount = Math.abs(Math.round(diffInWeeks));
  }

  return weekCount;
};

const changeQRUrlService = async (newBaseUrl) => {
  try {
    const result = await allModels.Attendance.update(
      {
        response_url_path: Sequelize.literal(
          `CONCAT('${newBaseUrl}', SUBSTRING(response_url_path, INSTR(response_url_path, '/attendance/response/')))`
        ),
      },
      {
        where: {
          response_url_path: { [Sequelize.Op.not]: null },
        },
      }
    );

    return result; // The result contains the number of rows updated
  } catch (error) {
    console.error("Error updating QR URLs:", error);
    return null;
  }
};

const resetDatabaseService = async () => {
  try {
    return await resetDBFunction();
  } catch (error) {
    // console.error("Error resetting DB:", error);

    const error1 = new Error(error);
    error1.statusCode = 500;
    throw error1;

    // return null;
  }
};

const getAllTeacherCountService = async () => {
  return await allModels.User.count();
};

const getAllTeachersSubjectCountService = async (userId) => {
  return await allModels.Subject.count({
    where: {
      teacher_user_id: userId,
    },
  });
};

const getAllTeachersSubjecsWithStudentCountService = async (userId) => {
  return await allModels.Subject.findAll({
    attributes: [
      // "id",
      "subject_name",
      "subject_code",
      // "is_started",
      // "updated_by",
      // "createdAt",
      // "updatedAt",
      // "user_id",
      // "teacher_user_id",
      [
        allModels.sequelize.fn(
          "COUNT",
          allModels.sequelize.fn(
            "DISTINCT",
            allModels.sequelize.col(
              "subject_schedules.student_subject_schedules.student_id"
            )
          )
        ),
        "student_count",
      ],
      // [
      //   allModels.sequelize.fn(
      //     "COUNT",
      //     allModels.sequelize.col(
      //       "subject_schedules.student_subject_schedules.student_id"
      //     )
      //   ),
      //   "student_count",
      // ],
    ],
    where: {
      teacher_user_id: userId,
    },
    include: [
      {
        model: allModels.SubjectSchedule,
        attributes: [],
        include: [
          {
            model: allModels.StudentSubjectSchedule,
            attributes: [],
            include: [
              {
                model: allModels.Student,
                attributes: [],
              },
            ],
          },
        ],
      },
    ],
    // distinct: true, // Count only distinct students
    group: ["Subject.id"], // Group by subject's ID
  });
};

const getAllTeachersStudentCountService = async (userId) => {
  return await allModels.Student.count({
    include: [
      {
        model: allModels.StudentSubjectSchedule,
        include: [
          {
            model: allModels.SubjectSchedule,
            include: [
              {
                model: allModels.Subject,
                where: {
                  teacher_user_id: userId,
                },
              },
            ],
          },
        ],
      },
    ],
    distinct: true, // Count only distinct students
  });
};

const getStudentsAttendanceWithWeekForEachSubjectService = async (
  subjectId
) => {
  return await allModels.Student.findAll({
    attributes: ["name", "student_code"],
    include: [
      {
        model: allModels.Grade,
        attributes: ["grade"],
        required: true,
        include: [
          {
            model: allModels.Lesson,
            attributes: [],
            where: {
              subject_id: subjectId,
            },
            required: true,
            include: [
              {
                model: allModels.LessonAssessment,
                attributes: [],
                where: {
                  is_attendance_add: true,
                },
                required: true,
              },
            ],
          },
        ],
      },
    ],
  });
};

module.exports = {
  getCurrentWeekService,
  getAllSemestersService,
  getSemesterByIdService,
  createSemesterService,
  updateSemesterService,
  deleteSemesterService,
  getCurrentWeekFunction,
  changeQRUrlService,
  resetDatabaseService,
  getAllTeacherCountService,
  getAllTeachersSubjectCountService,
  getAllTeachersStudentCountService,
  getAllTeachersSubjecsWithStudentCountService,
  getStudentsAttendanceWithWeekForEachSubjectService,
};
