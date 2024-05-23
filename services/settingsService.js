const allModels = require("../models");
const { Sequelize } = require("sequelize");
const { execFile } = require("child_process");
const { resetDBFunction } = require("../migrate");
const gradeService = require("../services/gradeService");

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
  return await allModels.User.count({
    where: {
      role_id: 2,
    },
  });
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
  const result = await allModels.Lesson.findAll({
    attributes: [
      "id",
      [
        Sequelize.literal(
          "COUNT(DISTINCT CASE WHEN `Grades`.`grade` >= 1 THEN `Grades`.`student_id` END)"
        ),
        "studentCount",
      ],
    ],
    where: {
      subject_id: subjectId,
    },
    include: [
      {
        model: allModels.Grade,
        attributes: [],
        required: false,
      },
      {
        model: allModels.LessonAssessment,
        attributes: [],
        where: {
          is_attendance_add: true,
        },
        // required: true,
      },
    ],
    group: ["Lesson.id"],
    raw: true,
  });

  const studentCounts = result.map((lesson) => lesson.studentCount || 0);
  return studentCounts;

  return await allModels.Student.findAll({
    attributes: ["name", "student_code"],
    include: [
      {
        model: allModels.Grade,
        attributes: ["grade"],
        // where: {
        //   grade: { [Sequelize.Op.gte]: 1 },

        // },
        // required: true,
        include: [
          {
            model: allModels.Lesson,
            attributes: [],
            where: {
              subject_id: subjectId,
            },
            // required: true,
            include: [
              {
                model: allModels.LessonAssessment,
                attributes: [],
                where: {
                  is_attendance_add: true,
                },
                // required: true,
              },
            ],
          },
        ],
      },
    ],
  });
};

const axios = require("axios");

const apiKey = process.env.GPT;

// const prompt = 'Translate the following English text to French: "Hello, how are you?"';

async function callOpenAIChatGPT(userId, prompt) {
  try {
    const gradeData = await gradeService.getAllStudentGradesChatGPTService(
      userId
    );
    const addedPrompt =
      "Json data: " +
      JSON.stringify(gradeData) +
      ". The provided JSON data contains detailed information about university subjects, " +
      "each associated with specific students. Each student's entry includes their name, " +
      "student code, and a list of their subject schedules, classified by lesson types " +
      "such as lectures ('Лекц') and labs ('Лаборатор'). For each schedule, detailed grade " +
      "records are provided, broken down by assessment codes and weekly performance. " +
      "Analyze this structured data to respond to academic-related queries using the same language as the question." +
      "For non-academic queries or general knowledge, respond based on your built-in knowledge and ignore the JSON data. " +
      "Note: 'Дүн' means grade, 'хичээл' means subject, 'хичээлийн төрөл'" +
      " means lesson type, 'оюутан' means student. REMEMBER. GIVE ME ANSWER. IF I ASK NUMBER GIVE ME NUMBER NO MATTER WHAT." +
      ' Question: "' +
      prompt +
      '?"' +
      "If the question is unrelated to the provided JSON, answer without referring to the JSON data";

    // "just give me answer and briefly describe your method before providing the answer.";

    console.log(addedPrompt);
    //  console.log(gradeData)

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        // prompt: prompt,
        model: "gpt-3.5-turbo-0125",
        messages: [
          {
            role: "system",
            content: addedPrompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const answer = response.data.choices[0]?.message?.content;
    const cleanedAnswer = cleanData(answer);

    // const answer = "123";
    // console.log("ChatGPT Response:", cleanedAnswer);
    return cleanedAnswer;
  } catch (error) {
    console.error("Error calling OpenAI ChatGPT:", error);
  }
}
const he = require("he"); // Ensure you have installed this package

function cleanData(input) {
  // Convert the input to a string if it isn't already
  let string = input.toString();

  // Replace tabs and multiple spaces with a single space
  string = string.replace(/\t+/g, " ");
  string = string.replace(/\s\s+/g, " ");
  string = string.replace(/\\"/g, '"'); // Double quotes
  string = string.replace(/\\n/g, "\n"); // New lines
  string = string.replace(/\\r/g, "\r"); // Carriage returns
  string = string.replace(/\\\\/g, "\\"); // Backslashes

  // Optionally, remove newline characters if you want everything in a single line
  // string = string.replace(/\n+/g, ' ');

  return string.trim();
}

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
  callOpenAIChatGPT,
};
