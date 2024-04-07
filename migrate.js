const models = require("./models/index");
const moment = require("moment-timezone");
const sequelize = require("./config/sequelizeConfig");
const bcrypt = require("bcryptjs");
const { Sequelize } = require("sequelize");

const main = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database sync complete.");
    await insertRandomData();
    console.log("Random data inserted successfully.");
  } catch (err) {
    console.error("Error during database operation:", err);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

const subjectNames = [
  "Математик",
  "Англи хэл",
  "Програмчлалын үндэс",
  "Хэл ярианы соёл",
  "Хиймэл оюун ухаан",
  "Дискрет бүтэц",
  "Биеийн тамир",
  "Өгөгдлийн бүтэц",
  "Програм хангамж ба архитектур",
  "Гамшгаас хамгаалах",
];

const peopleNames = [
  "Батбаяр",
  "Оюунбилэг",
  "Алтанцэцэг",
  "Сарнай",
  "Ганболд",
  "Хулан",
  "Энхжаргал",
  "Түмэнжаргал",
  "Нэргүй",
  "Мөнхбат",
  "Чимэдцэрэн",
  "Цолмон",
  "Баярмаа",
  "Жаргал",
  "Эрдэнэтүяа",
  "Болд",
  "Амарбаясгалан",
  "Зоригт",
  "Гантулга",
  "Үянга",
];

const peopleNamesEn = [
  "Batbayar",
  "Oyunbileg",
  "Altantsetseg",
  "Sarnai",
  "Ganbold",
  "Khulan",
  "Enkhjargal",
  "Tumenjargal",
  "Nergui",
  "Mönkhbat",
  "Chimedtseren",
  "Tsolmon",
  "Bayarmaa",
  "Jargal",
  "Erdenetuya",
  "Bold",
  "Amarbayasgalan",
  "Zorigt",
  "Gantulga",
  "Uyanga",
];

const teacherCodes = [
  "A.SW01",
  "B.SW12",
  "C.SW23",
  "D.SW34",
  "E.SW45",
  "F.SW56",
  "G.SW67",
  "H.SW78",
  "I.SW89",
  "J.SW90",
  "K.SW02",
  "L.SW13",
  "M.SW24",
  "N.SW35",
  "O.SW46",
  "P.SW57",
  "Q.SW68",
  "R.SW79",
  "S.SW80",
  "T.SW91",
];

const studentCodes = [
  "B200101045",
  "B200202230",
  "B200303315",
  "B200404401",
  "B200505502",
  "B200606603",
  "B200707704",
  "B200808805",
  "B200909906",
  "B201010107",
  "B210111208",
  "B210212309",
  "B210313410",
  "B210414511",
  "B220515612",
  "B220616713",
  "B220717814",
  "B220818915",
  "B230919016",
  "B231020117",
];

const lessonTypes = [
  {
    name: "Лекц",
    code: "лк",
    count: 16,
  },
  {
    name: "Лекц тэгш",
    code: "лктэгш",
    count: 8,
  },
  {
    name: "Лекц сондгой",
    code: "лксонд",
    count: 8,
  },
  {
    name: "Лаборатор",
    code: "лаб",
    count: 16,
  },
  {
    name: "Лаборатор тэгш",
    code: "лабтэгш",
    count: 8,
  },
  {
    name: "Лаборатор сондгой",
    code: "лабсонд",
    count: 8,
  },
  {
    name: "Семинар",
    code: "сем",
    count: 16,
  },
  {
    name: "Семинар тэгш",
    code: "семтэгш",
    count: 8,
  },
  {
    name: "Семинар сондгой",
    code: "семсонд",
    count: 8,
  },
  {
    name: "Бие даалт",
    code: "бд",
    count: 3,
  },
  {
    name: "Практик",
    code: "пр",
    count: 5,
  },
];
const lectureLessonAssessments = [
  {
    code: "CF1",
    desc: "Цаг төлөвлөлт, хариуцлага",
  },
  {
    code: "CF2",
    desc: "Сурах хүсэл эрмэлзлэл, өөрийгөө илэрхийлэх",
  },
];

const sorilLessonAssessments = [
  {
    code: "CT3",
    desc: "Мэдлэгээ сэргээн санах, тайлбарлах",
  },
  {
    code: "CT4",
    desc: "Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шинжлэх",
  },
  {
    code: "CT5",
    desc: "Мэдлэгээ сэргээн санах, тайлбарлах",
  },
  {
    code: "CT6",
    desc: "Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шинжлэх",
  },
];

const laboratoryLessonAssessments = [
  {
    code: "CD7",
    desc: "Лабаораторийн хэмжилт, туршилт, даалгавар гүйцэтгэх",
  },
  {
    code: "CD8",
    desc: "Үр дүнг тохирох аргаар, өгөгдсөн форматын дагуу боловсруулж тайлагнах",
  },
];

const assignmentLessonAssessments = [
  {
    code: "CD9",
    desc: "Өгөгдсөн даалгаврын хүрээнд шийдвэрлэх асуудлаа тодорхойлж, томёолох",
  },
  {
    code: "CD10",
    desc: "Шийдвэрлэх асуудлын хүрээнд тодорхой шийдэл дэвшүүлэх, дүн шинжилгээ хийх",
  },
  {
    code: "CD11",
    desc: "Мэдлэг ур чадвараа ашиглан сонгосон шийдлийн дагуу асуудлыг шийдвэрлэх",
  },
  {
    code: "CD12",
    desc: "Бичгийн болон харилцах ур чадвараа ашиглан үр дүнг өгөгдсөн форматын дагуу тайлагнах илтгэх",
  },
];

const testLessonAssessments = [
  {
    code: "XX1",
    desc: "Тест үнэлгээ 1...",
  },
  {
    code: "XX2",
    desc: "Тест үнэлгээ 2...",
  },
];

const subjectCodes = [
  "F.CS101",
  "F.CS102",
  "S.ML103",
  "S.MT101",
  "S.PH101",
  "S.SS102",
  "F.CS100",
  "S.CE102",
  "F.EE101",
  "S.MT102",
];

const scheduleNames = [
  "Даваа: 1-р паар",
  "Даваа: 2-р паар",
  "Даваа: 3-р паар",
  "Даваа: 4-р паар",
  "Даваа: 5-р паар",
  "Даваа: 6-р паар",
  "Даваа: 7-р паар",

  "Мягмар: 1-р паар",
  "Мягмар: 2-р паар",
  "Мягмар: 3-р паар",
  "Мягмар: 4-р паар",
  "Мягмар: 5-р паар",
  "Мягмар: 6-р паар",
  "Мягмар: 7-р паар",

  "Лхагва: 1-р паар",
  "Лхагва: 2-р паар",
  "Лхагва: 3-р паар",
  "Лхагва: 4-р паар",
  "Лхагва: 5-р паар",
  "Лхагва: 6-р паар",
  "Лхагва: 7-р паар",

  "Пүрэв: 1-р паар",
  "Пүрэв: 2-р паар",
  "Пүрэв: 3-р паар",
  "Пүрэв: 4-р паар",
  "Пүрэв: 5-р паар",
  "Пүрэв: 6-р паар",
  "Пүрэв: 7-р паар",

  "Баасан: 1-р паар",
  "Баасан: 2-р паар",
  "Баасан: 3-р паар",
  "Баасан: 4-р паар",
  "Баасан: 5-р паар",
  "Баасан: 6-р паар",
  "Баасан: 7-р паар",
];

const scheduleDays = [
  1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4,
  4, 4, 5, 5, 5, 5, 5, 5, 5,
];
const scheduleTimes = [
  1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5,
  6, 7, 1, 2, 3, 4, 5, 6, 7,
];

const MAX_GRADE = 10;

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
    { role_name: "Салбарын эрхлэгч" },
  ]);

  for (let i = 0; i < scheduleNames.length; i++) {
    await models.Schedule.create({
      schedule_name: scheduleNames[i],
      schedule_day: scheduleDays[i],
      schedule_time: scheduleTimes[i],
    });
  }

  const lectureLessonTypes = await models.LessonType.bulkCreate([
    {
      lesson_type_name: lessonTypes[0].name,
      lesson_type_code_for_excel: lessonTypes[0].code,
      lesson_type_iterate_count: lessonTypes[0].count,
    },
    {
      lesson_type_name: lessonTypes[1].name,
      lesson_type_code_for_excel: lessonTypes[1].code,
      lesson_type_iterate_count: lessonTypes[1].count,
    },
    {
      lesson_type_name: lessonTypes[2].name,
      lesson_type_code_for_excel: lessonTypes[2].code,
      lesson_type_iterate_count: lessonTypes[2].count,
    },
  ]);

  for (let i = 0; i < lectureLessonTypes.length; i++) {
    for (let j = 0; j < lectureLessonAssessments.length; j++) {
      await models.LessonAssessment.create({
        lesson_assessment_code: lectureLessonAssessments[j].code,
        lesson_assessment_description: lectureLessonAssessments[j].desc,
        lesson_type_id: lectureLessonTypes[i].id,
      });
    }
  }

  const laboratoryLessonTypes = await models.LessonType.bulkCreate([
    {
      lesson_type_name: lessonTypes[3].name,
      lesson_type_code_for_excel: lessonTypes[3].code,
      lesson_type_iterate_count: lessonTypes[3].count,
    },
    {
      lesson_type_name: lessonTypes[4].name,
      lesson_type_code_for_excel: lessonTypes[4].code,
      lesson_type_iterate_count: lessonTypes[4].count,
    },
    {
      lesson_type_name: lessonTypes[5].name,
      lesson_type_code_for_excel: lessonTypes[5].code,
      lesson_type_iterate_count: lessonTypes[5].count,
    },
  ]);

  for (let i = 0; i < laboratoryLessonTypes.length; i++) {
    for (let j = 0; j < laboratoryLessonAssessments.length; j++) {
      await models.LessonAssessment.create({
        lesson_assessment_code: laboratoryLessonAssessments[j].code,
        lesson_assessment_description: laboratoryLessonAssessments[j].desc,
        lesson_type_id: laboratoryLessonTypes[i].id,
      });
    }
  }

  const seminarLessonTypes = await models.LessonType.bulkCreate([
    {
      lesson_type_name: lessonTypes[6].name,
      lesson_type_code_for_excel: lessonTypes[6].code,
      lesson_type_iterate_count: lessonTypes[6].count,
    },
    {
      lesson_type_name: lessonTypes[7].name,
      lesson_type_code_for_excel: lessonTypes[7].code,
      lesson_type_iterate_count: lessonTypes[7].count,
    },
    {
      lesson_type_name: lessonTypes[8].name,
      lesson_type_code_for_excel: lessonTypes[8].code,
      lesson_type_iterate_count: lessonTypes[8].count,
    },
  ]);

  for (let i = 0; i < seminarLessonTypes.length; i++) {
    for (let j = 0; j < testLessonAssessments.length; j++) {
      await models.LessonAssessment.create({
        lesson_assessment_code: testLessonAssessments[j].code,
        lesson_assessment_description: testLessonAssessments[j].desc,
        lesson_type_id: seminarLessonTypes[i].id,
      });
    }
  }
  
  const assignmentLessonType = await models.LessonType.create({
    lesson_type_name: lessonTypes[9].name,
    lesson_type_code_for_excel: lessonTypes[9].code,
    lesson_type_iterate_count: lessonTypes[9].count,
  });

  for (let i = 0; i < assignmentLessonAssessments.length; i++) {
    await models.LessonAssessment.create({
      lesson_assessment_code: assignmentLessonAssessments[i].code,
      lesson_assessment_description: assignmentLessonAssessments[i].desc,
      lesson_type_id: assignmentLessonType.id,
    });
  }

  
  const practicLessonType = await models.LessonType.create({
    lesson_type_name: lessonTypes[10].name,
    lesson_type_code_for_excel: lessonTypes[10].code,
    lesson_type_iterate_count: lessonTypes[10].count,
  });

  for (let i = 0; i < testLessonAssessments.length; i++) {
    await models.LessonAssessment.create({
      lesson_assessment_code: testLessonAssessments[i].code,
      lesson_assessment_description: testLessonAssessments[i].desc,
      lesson_type_id: practicLessonType.id,
    });
  }

  await models.School.create({
    school_name: "ШУТИС",
    is_active: true,
  });

  await models.User.create({
    name: "ШУТИС админ",
    email: "admin@gmail.com",
    code: "admin",
    role_id: 1,
    password: await bcrypt.hash("Pass@123", 10),
    school_id: 1,
  });

  await models.Semester.create({
    semester_code: "2024B - Хаврын улирал",
    start_date: new Date("2024-01-24"),
    is_active: true,
    user_id: 1,
  });

  await models.SubSchool.create({
    sub_school_name: "ШУТИС - МХТС",
    // sub_school_latitude1: "47.918194",
    // sub_school_longitude1: "106.929824",
    // sub_school_latitude2: "47.918280",
    // sub_school_longitude2: "106.933118",
    // sub_school_latitude3: "47.916190",
    // sub_school_longitude3: "106.933957",
    // sub_school_latitude4: "47.916256",
    // sub_school_longitude4: "106.930050",
    is_active: true,
    user_id: 1,
    school_id: 1,
  });

  // await models.User.create({
  //   name: "Өлзиймаа",
  //   email: "zma@gmail.com",
  //   code: "zma",
  //   role_id: 2,
  //   password: await bcrypt.hash("Pass@123", 10),
  //   sub_school_id: 1,
  // });

  await models.Menu.bulkCreate([
    {
      menu_code: "00",
      parent_id: 0,
      menu_name: "ХЯНАЛТ",
      router_link: "",
      sorted_order: 0,
      icon_name: "",
    },
    {
      menu_code: "01",
      parent_id: 0,
      menu_name: "ҮНДСЭН ХЭСЭГ",
      router_link: "",
      sorted_order: 1,
      icon_name: "",
    },
    {
      menu_code: "02",
      parent_id: 0,
      menu_name: "БҮРТГЭЛ",
      router_link: "",
      sorted_order: 2,
      icon_name: "",
    },
    {
      menu_code: "0001",
      parent_id: 1,
      menu_name: "Дашбоард",
      router_link: "/dashboard",
      sorted_order: 1,
      icon_name: "material-symbols:dashboard-outline",
    },
    {
      menu_code: "0002",
      parent_id: 1,
      menu_name: "Салбар сургууль",
      router_link: "/dashboard/subSchools",
      sorted_order: 2,
      icon_name: "material-symbols:dashboard-outline",
    },
    {
      menu_code: "0101",
      parent_id: 2,
      menu_name: "Хичээл",
      router_link: "/dashboard/subject",
      sorted_order: 1,
      icon_name: "material-symbols-light:subject",
    },
    {
      menu_code: "0102",
      parent_id: 2,
      menu_name: "Хичээлийн задаргаа",
      router_link: "/dashboard/lessons",
      sorted_order: 2,
      icon_name: "material-symbols-light:subject",
    },
    {
      menu_code: "0103",
      parent_id: 2,
      menu_name: "Хичээл орох хэлбэр",
      router_link: "/dashboard/lessonTypes",
      sorted_order: 3,
      icon_name: "material-symbols-light:subject",
    },
    {
      menu_code: "0104",
      parent_id: 2,
      menu_name: "Дүнгийн задаргаа",
      router_link: "/dashboard/lessonAsses",
      sorted_order: 4,
      icon_name: "material-symbols-light:subject",
    },
    {
      menu_code: "0105",
      parent_id: 2,
      menu_name: "Оюутнууд",
      router_link: "/dashboard/students",
      sorted_order: 4,
      icon_name: "material-symbols-light:subject",
    },
    {
      menu_code: "0201",
      parent_id: 3,
      menu_name: "Хэрэглэгч",
      router_link: "/dashboard/users",
      sorted_order: 1,
      icon_name: "material-symbols-light:subject",
    },
    {
      menu_code: "0202",
      parent_id: 3,
      menu_name: "Хэрэглэгчийн бүлэг",
      router_link: "/dashboard/userRole",
      sorted_order: 2,
      icon_name: "material-symbols-light:subject",
    },
    {
      menu_code: "0203",
      parent_id: 3,
      menu_name: "Багшийн портфолио",
      router_link: "/dashboard/userFile",
      sorted_order: 3,
      icon_name: "material-symbols-light:subject",
    },
  ]);

  const adminMenus = await models.Menu.findAll({
    where: {
      [Sequelize.Op.or]: [
        { menu_code: { [Sequelize.Op.like]: "00%" } },
        { menu_code: { [Sequelize.Op.like]: "01" } },
        { menu_code: { [Sequelize.Op.like]: "0103%" } },
        { menu_code: { [Sequelize.Op.like]: "0104%" } },
        { menu_code: { [Sequelize.Op.like]: "02%" } },
      ],
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
      [Sequelize.Op.or]: [
        { menu_code: { [Sequelize.Op.like]: "00" } },
        { menu_code: { [Sequelize.Op.like]: "0001%" } },
        { menu_code: { [Sequelize.Op.like]: "01" } },
        { menu_code: { [Sequelize.Op.like]: "0101%" } },
      ],
    },
  });

  for (const teacherMenu of teacherMenus) {
    await models.UserRoleMenu.create({
      user_role_id: 2,
      menu_id: teacherMenu.id,
    });
  }

  // await models.UserFile.bulkCreate([
  //   {
  //     user_id: 2,
  //     file_name: "1-р файл",
  //     file_path: Math.floor(Math.random()),
  //     file_type: "1-р гэрчилгээ",
  //   },
  //   {
  //     user_id: 2,
  //     file_name: "2-р файл",
  //     file_path: Math.floor(Math.random()),
  //     file_type: "1-р гэрчилгээ",
  //   },
  // ]);

  // for (let i = 0; i < 10; i++) {
  //   const randomDataContainer = generateRandomData();

  //   //Create a exampleUser
  //   const exampleUser = await models.User.create({
  //     name: peopleNames[i],
  //     email: peopleNamesEn[i] + "@must.com",
  //     code: teacherCodes[i],
  //     // Assume role_id is set correctly
  //     role_id: exampleRole.id,
  //   });

  //   // Create a exampleUser
  //   await models.UserFile.create({
  //     user_id: exampleUser.id,
  //     file_name: i + "-р файл",
  //     file_path: Math.floor(i * Math.random()),
  //     file_type: (i % 4) + "-р гэрчилгээ",
  //   });

  //   // Create a exampleSubject
  //   const exampleSubject = await models.Subject.create({
  //     subject_name: subjectNames[i],
  //     subject_code: subjectCodes[i],
  //     user_id: i % 2 == 0 ? 1 : 3,
  //     isStarted: true,
  //   });

  //   // Additional teachers as assistant teachers

  //   var randomLessonTypeId1 =
  //     Math.floor(Math.random() * lessonTypeNames.length) + 1;

  //   await models.SubjectLessonType.create({
  //     subject_id: exampleSubject.id,
  //     lesson_type_id: randomLessonTypeId1, // Random lesson type
  //     lesson_count: 16,
  //     max_score: 3,
  //   });

  //   var randomLessonTypeId2 =
  //     Math.floor(Math.random() * lessonTypeNames.length) + 1;

  //   if (randomLessonTypeId1 != randomLessonTypeId2) {
  //     await models.SubjectLessonType.create({
  //       subject_id: exampleSubject.id,
  //       lesson_type_id: randomLessonTypeId2, // Random lesson type
  //       lesson_count: 16,
  //       max_score: 3,
  //     });
  //   }

  //   // Create a lesson type (assuming lesson types are predefined and have specific IDs)
  //   const exampleLessonType = await models.LessonType.findOne({
  //     where: { id: Math.floor(Math.random() * lessonTypeNames.length) + 1 },
  //     include: [
  //       {
  //         model: models.LessonAssessment,
  //       },
  //     ],
  //   });

  //   const exampleLessonType2 = await models.LessonType.findOne({
  //     where: { id: Math.floor(Math.random() * lessonTypeNames.length) + 1 },
  //     include: [
  //       {
  //         model: models.LessonAssessment,
  //       },
  //     ],
  //   });

  //   // await exampleUser.addSubject(exampleSubject);

  //   // await models.TeacherSubject.create({
  //   //   user_id: exampleUser.id,
  //   //   subject_id: exampleSubject.id,
  //   //   lesson_type_id: exampleLessonType.id,
  //   // });

  //   // Create a exampleSubject schedule
  //   const validScheduleId1 = 1; // Example ID, replace with a valid ID from your schedule table
  //   const validScheduleId2 = 2; // Example ID, replace with a valid ID from your schedule table

  //   const exampleSubjectSchedule = await models.SubjectSchedule.create({
  //     subject_id: exampleSubject.id,
  //     lesson_type_id: exampleLessonType.id,
  //     schedule_id: validScheduleId1,
  //   });

  //   const exampleSubjectSchedule2 = await models.SubjectSchedule.create({
  //     subject_id: exampleSubject.id,
  //     lesson_type_id: exampleLessonType2.id,
  //     schedule_id: validScheduleId2,
  //   });

  //   // Create lessons
  //   for (let week = 1; week <= 4; week++) {
  //     if (exampleLessonType && exampleLessonType.lesson_assessments) {
  //       for (const assessment of exampleLessonType.lesson_assessments) {
  //         await models.Lesson.create({
  //           subject_id: exampleSubject.id,
  //           lesson_assessment_id: assessment.id,
  //           week_number: week,
  //           lesson_number: week,
  //         });
  //       }
  //       for (const assessment of exampleLessonType2.lesson_assessments) {
  //         await models.Lesson.create({
  //           subject_id: exampleSubject.id,
  //           lesson_assessment_id: assessment.id,
  //           week_number: week,
  //           lesson_number: week,
  //         });
  //       }
  //     }
  //   }

  //   // Create a student
  //   const student = await models.Student.create({
  //     name: peopleNames[Math.floor(Math.random() * peopleNames.length)],
  //     student_code: studentCodes[i],
  //   });

  //   // Enroll student in the exampleSubject schedule (assuming this represents the student being allocated to a specific schedule)
  //   await models.StudentSubjectSchedule.create({
  //     student_id: student.id,
  //     subject_schedule_id: exampleSubjectSchedule.id,
  //   });
  //   await models.StudentSubjectSchedule.create({
  //     student_id: student.id,
  //     subject_schedule_id: exampleSubjectSchedule2.id,
  //   });

  //   const allLessons = await models.Lesson.findAll();

  //   for (const lesson of allLessons) {
  //     await models.Grade.create({
  //       student_id: student.id,
  //       lesson_id: lesson.id,
  //       grade: generateRandomGrade(MAX_GRADE),
  //     });
  //   }
  // }

  // const attendanceObject = await models.Attendance.create({
  //   lesson_id: 1,
  //   subject_schedule_id: 1,
  //   qr_code: "asdqw",
  //   attendance_url_path: "asdqw",
  //   response_url_path: "qwer",
  //   is_active: true,
  //   expired_at: new Date(),
  //   usage_count: 12,
  // });
  // await models.AttendanceResponse.create({
  //   user_id: attendanceObject.id,
  //   submitted_name: "Мөнх-Очир",
  //   submitted_code: "B200910045",
  //   attendance_date: new Date(),
  // });
};

main();
