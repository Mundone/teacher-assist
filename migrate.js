const models = require("./models/index");
const sequelize = require("./config/sequelizeConfig");
const bcrypt = require("bcryptjs");
const { Sequelize } = require("sequelize");
const { profileUrl } = require("./config/const");

const {
  lessonTypes,
  lectureLessonAssessments,
  // sorilLessonAssessments,
  laboratoryLessonAssessments,
  assignmentLessonAssessments,
  seminarLessonAssessments,
  // testLessonAssessments,
  // subjectCodes,
  scheduleNames,
  scheduleDays,
  scheduleTimes,
  menuDatas,
  adminMenuCodes,
  headOfDepartmentMenuCodes,
  teacherMenuCodes,
  surveys,
  questions,
  offeredAnswers,
  responses,students
} = require("./dummyDatas");

const resetDBFunction = async () => {
  // try {
  await sequelize.sync({ force: true });
  console.log("Database sync complete.");
  await insertRandomData();
  console.log("Random data inserted successfully.");
  // } catch (err) {
  //   console.error("Error during database operation:", err);
  //   return err;
  // } finally {
  // await sequelize.close();
  // console.log("Database connection closed.");
  // }
};

const generateRandomData = () => {
  const randomDay = Math.floor(Math.random() * 7) + 1; // Day of the week, 1 (Monday) - 7 (Sunday)
  const randomTime = Math.floor(Math.random() * 10) + 1; // Assuming time slots are numbered
  return { randomDay, randomTime };
};

const generateRandomGrade = (maxGrade) =>
  Math.floor(Math.random() * (maxGrade + 1));

const insertRandomData = async () => {
  //teacherRole
  await models.UserRole.bulkCreate([
    { role_name: "Админ" },
    { role_name: "Багш" },
    // { role_name: "Тэнхимийн эрхлэгч" },
    // { role_name: "Оюутан" },
  ]);

  for (let i = 0; i < scheduleNames.length; i++) {
    await models.Schedule.create({
      schedule_name: scheduleNames[i],
      schedule_day: scheduleDays[i],
      schedule_time: scheduleTimes[i],
    });
  }

  const lectureLessonTypesToCreate = [];
  for (let i = 0; i < 3; i++) {
    lectureLessonTypesToCreate.push({
      lesson_type_name: lessonTypes[i].name,
      lesson_type_code_for_excel: lessonTypes[i].code,
      lesson_type_iterate_count: lessonTypes[i].count,
      parent_lesson_type_id: lessonTypes[i].parent_lesson_type_id,
      lesson_type_sort: lessonTypes[i].sort,
      is_attendance_add: lessonTypes[i].is_attendance_add,
    });
  }
  const lectureLessonTypes = await models.LessonType.bulkCreate(
    lectureLessonTypesToCreate
  );

  for (let i = 0; i < lectureLessonTypes.length; i++) {
    for (let j = 0; j < lectureLessonAssessments.length; j++) {
      await models.LessonAssessment.create({
        lesson_assessment_code: lectureLessonAssessments[j].code,
        lesson_assessment_description: lectureLessonAssessments[j].desc,
        lesson_type_id: lectureLessonTypes[i].id,
        lesson_assessment_sort: lectureLessonAssessments[j].sort,
        default_grade: lectureLessonAssessments[j].def_grade,
        is_attendance_add: lectureLessonAssessments[j].is_attendance_add,
      });
    }
  }

  const laboratoryLessonTypesToCreate = [];
  for (let i = 3; i < 6; i++) {
    laboratoryLessonTypesToCreate.push({
      lesson_type_name: lessonTypes[i].name,
      lesson_type_code_for_excel: lessonTypes[i].code,
      lesson_type_iterate_count: lessonTypes[i].count,
      parent_lesson_type_id: lessonTypes[i].parent_lesson_type_id,
      lesson_type_sort: lessonTypes[i].sort,
      is_attendance_add: lessonTypes[i].is_attendance_add,
    });
  }
  const laboratoryLessonTypes = await models.LessonType.bulkCreate(
    laboratoryLessonTypesToCreate
  );

  for (let i = 0; i < laboratoryLessonTypes.length; i++) {
    for (let j = 0; j < laboratoryLessonAssessments.length; j++) {
      await models.LessonAssessment.create({
        lesson_assessment_code: laboratoryLessonAssessments[j].code,
        lesson_assessment_description: laboratoryLessonAssessments[j].desc,
        lesson_type_id: laboratoryLessonTypes[i].id,
        lesson_assessment_sort: laboratoryLessonAssessments[j].sort,
        default_grade: laboratoryLessonAssessments[j].def_grade,
        is_attendance_add: laboratoryLessonAssessments[j].is_attendance_add,
      });
    }
  }

  const seminarLessonTypesToCreate = [];
  for (let i = 6; i < 9; i++) {
    seminarLessonTypesToCreate.push({
      lesson_type_name: lessonTypes[i].name,
      lesson_type_code_for_excel: lessonTypes[i].code,
      lesson_type_iterate_count: lessonTypes[i].count,
      parent_lesson_type_id: lessonTypes[i].parent_lesson_type_id,
      lesson_type_sort: lessonTypes[i].sort,
      is_attendance_add: lessonTypes[i].is_attendance_add,
    });
  }
  const seminarLessonTypes = await models.LessonType.bulkCreate(
    seminarLessonTypesToCreate
  );

  for (let i = 0; i < seminarLessonTypes.length; i++) {
    for (let j = 0; j < seminarLessonAssessments.length; j++) {
      await models.LessonAssessment.create({
        lesson_assessment_code: seminarLessonAssessments[j].code,
        lesson_assessment_description: seminarLessonAssessments[j].desc,
        lesson_type_id: seminarLessonTypes[i].id,
        lesson_assessment_sort: seminarLessonAssessments[j].sort,
        default_grade: seminarLessonAssessments[j].def_grade,
        is_attendance_add: seminarLessonAssessments[j].is_attendance_add,
      });
    }
  }

  const assignmentLessonType = await models.LessonType.create({
    lesson_type_name: lessonTypes[9].name,
    lesson_type_code_for_excel: lessonTypes[9].code,
    lesson_type_iterate_count: lessonTypes[9].count,
    parent_lesson_type_id: lessonTypes[9].parent_lesson_type_id,
    lesson_type_sort: lessonTypes[9].sort,
    is_attendance_add: lessonTypes[9].is_attendance_add,
  });

  for (let i = 0; i < assignmentLessonAssessments.length; i++) {
    await models.LessonAssessment.create({
      lesson_assessment_code: assignmentLessonAssessments[i].code,
      lesson_assessment_description: assignmentLessonAssessments[i].desc,
      lesson_type_id: assignmentLessonType.id,
      lesson_assessment_sort: assignmentLessonAssessments[i].sort,
      default_grade: assignmentLessonAssessments[i].def_grade,
      is_attendance_add: assignmentLessonAssessments[i].is_attendance_add,
    });
  }

  const practicLessonType = await models.LessonType.create({
    lesson_type_name: lessonTypes[10].name,
    lesson_type_code_for_excel: lessonTypes[10].code,
    lesson_type_iterate_count: lessonTypes[10].count,
    parent_lesson_type_id: lessonTypes[10].parent_lesson_type_id,
    lesson_type_sort: lessonTypes[10].sort,
    is_attendance_add: lessonTypes[10].is_attendance_add,
  });

  // for (let i = 0; i < testLessonAssessments.length; i++) {
  //   await models.LessonAssessment.create({
  //     lesson_assessment_code: testLessonAssessments[i].code,
  //     lesson_assessment_description: testLessonAssessments[i].desc,
  //     lesson_type_id: practicLessonType.id,
  //     lesson_assessment_sort: testLessonAssessments[i].sort,
  //     default_grade: testLessonAssessments[i].def_grade,
  //     is_attendance_add: testLessonAssessments[i].is_attendance_add,
  //   });
  // }

  await models.School.bulkCreate([
    {
      school_name: "ШУТИС",
      is_active: true,
    },
    {
      school_name: "МУИС",
      is_active: true,
    },
  ]);

  await models.User.bulkCreate([
    {
      name: "ШУТИС админ",
      email: "admin@gmail.com",
      code: "admin",
      role_id: 1,
      password: await bcrypt.hash("Pass@123", 10),
      school_id: 1,
      // profile_image: profileUrl + "admin",
    },
    // {
    //   name: "Тэнхимийн эрхлэгч өвөө",
    //   email: "headOfDepartment@gmail.com",
    //   code: "dep",
    //   role_id: 2,
    //   password: await bcrypt.hash("Pass@123", 10),
    //   school_id: 1,
    //   is_head_of_department: true,
    //   // profile_image: profileUrl + "dep",
    // },
    // {
    //   name: "Нарийн бичиг хатагтай",
    //   email: "secretary@gmail.com",
    //   code: "sec",
    //   role_id: 2,
    //   password: await bcrypt.hash("Pass@123", 10),
    //   school_id: 1,
    //   is_secretary: true,
    //   // profile_image: profileUrl + "sec",
    // },
  ]);

  await models.Semester.create({
    semester_code: "2024B - Хаврын улирал",
    start_date: new Date("2024-01-24"),
    is_active: true,
    user_id: 1,
  });

  // await models.SubSchool.bulkCreate([
  //   {
  //     sub_school_name: "ШУТИС - МХТС",
  //     is_active: true,
  //     user_id: 1,
  //     school_id: 1,
  //   },
  //   {
  //     sub_school_name: "ШУТИС - БУХС",
  //     is_active: true,
  //     user_id: 1,
  //     school_id: 1,
  //   },
  //   {
  //     sub_school_name: "ШУТИС - ЭХИС",
  //     is_active: true,
  //     user_id: 1,
  //     school_id: 1,
  //   },
  // ]);

  await models.Menu.bulkCreate(menuDatas);

  const adminMenus = await models.Menu.findAll({
    where: {
      menu_code: { [Sequelize.Op.in]: adminMenuCodes },
    },
  });

  for (const adminMenu of adminMenus) {
    await models.UserRoleMenu.create({
      user_role_id: 1,
      menu_id: adminMenu.id,
    });
  }

  const teacherMenus = await models.Menu.findAll({
    where: {
      menu_code: { [Sequelize.Op.in]: teacherMenuCodes },
    },
  });

  for (const teacherMenu of teacherMenus) {
    await models.UserRoleMenu.create({
      user_role_id: 2,
      menu_id: teacherMenu.id,
    });
  }

  for (const survey of surveys) {
    await models.Survey.create({
      survey_title: survey.survey_title,
      description: survey.description,
    });
  }
  
  for (const question of questions) {
    await models.Question.create({
      question_text: question.question_text,
      description: question.description,
      type: question.type,
    });
  }
  
  for (const answer of offeredAnswers) {
    await models.OfferedAnswer.create({
      value: answer.value,
    });
  }

  for (const student of students) {
    await models.Student.create({
      name: student.name,
      student_code: student.student_code,
      email: student.email,
      password: student.password,
    });
  }
  
  for (const response of responses) {
    await models.Response.create({
      student_id: response.student_id,
      question_id: response.question_id,
      answer_text: response.answer_text,
    });
  }
  
  // const headOfDepartmentMenus = await models.Menu.findAll({
  //   where: {
  //     menu_code: { [Sequelize.Op.in]: headOfDepartmentMenuCodes },
  //   },
  // });

  // for (const teacherMenu of headOfDepartmentMenus) {
  //   await models.UserRoleMenu.create({
  //     user_role_id: 3,
  //     menu_id: teacherMenu.id,
  //   });
  // }
};

module.exports = {
  resetDBFunction,
};
