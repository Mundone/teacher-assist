const models = require("./models/index");
const moment = require("moment-timezone");
const sequelize = require("./config/sequelizeConfig");
const bcrypt = require("bcryptjs");
const { Sequelize } = require("sequelize");

const main = async () => {
  try {
    await sequelize.sync();
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

const lessonTypeNames = [
  "Лекц",
  "Лаборатор",
  "Семинар",
  "Бие даалт",
  "Практик",
];

lessonAssessmentCodes = [
  "CF1",
  "CF2",
  "CT3",
  "CT4",
  "CT5",
  "CT5",
  "CT6",
  "CD7",
  "CD8",
  "CD9",
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

lessonAssessmentDescriptions = [
  "Цаг төлөвлөлт, хариуцлага",
  "Сурах хүсэл эрмэлзлэл, өөрийгөө илэрхийлэх",
  "Мэдлэгээ сэргээн санах, тайлбарлах",
  "Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шинжлэх",
  "Мэдлэгээ сэргээн санах, тайлбарлах",
  "Асуудал шийдвэрлэхэд мэдлэгээ хэрэглэх, задлан шинжлэх",
  "Лабаораторийн хэмжилт, туршилт, даалгавар гүйцэтгэх",
  "Үр дүнг тохирох аргаар, өгөгдсөн форматын дагуу боловсруулж тайлагнах",
  "Өгөгдсөн даалгаврын хүрээнд шийдвэрлэх асуудлаа тодорхойлж, томёолох",
  "Шийдвэрлэх асуудлын хүрээнд тодорхой шийдэл дэвшүүлэх, дүн шинжилгээ хийх",
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
  await models.UserRole.create({ role_name: "Админ" });
  const exampleRole = await models.UserRole.create({ role_name: "Багш" });
  await models.UserRole.create({ role_name: "Салбарын эрхлэгч" });

  for (let i = 0; i < lessonTypeNames.length; i++) {
    const exampleLessonType = await models.LessonType.create({
      lesson_type_name: lessonTypeNames[i],
    });
    await models.LessonAssessment.create({
      lesson_assessment_code: lessonAssessmentCodes[i * 2],
      lesson_assessment_description: lessonAssessmentDescriptions[i * 2],
      lesson_type_id: exampleLessonType.id,
    });
    await models.LessonAssessment.create({
      lesson_assessment_code: lessonAssessmentCodes[i * 2 + 1],
      lesson_assessment_description: lessonAssessmentDescriptions[i * 2 + 1],
      lesson_type_id: exampleLessonType.id,
    });
  }

  await models.LessonAssessment.create({
    lesson_assessment_code: "Test code",
    lesson_assessment_description: "Test desc",
    lesson_type_id: lessonTypeNames.length,
  });

  await models.User.create({
    name: "Ulziimaa",
    email: "zma@gmail.com",
    code: "zma",
    // Assume role_id is set correctly
    role_id: 2,
    password: await bcrypt.hash("Pass@123", 10),
  });

  await models.User.create({
    name: "adminName",
    email: "admin@gmail.com",
    code: "admin",
    // Assume role_id is set correctly
    role_id: 1,
    password: await bcrypt.hash("Pass@123", 10),
  });

  for (let i = 0; i < 10; i++) {
    const randomDataContainer = generateRandomData();

    // Create a exampleUser
    const exampleUser = await models.User.create({
      name: peopleNames[i],
      email: peopleNamesEn[i] + "@must.com",
      code: teacherCodes[i],
      // Assume role_id is set correctly
      role_id: exampleRole.id,
    });

    // Create a exampleUser
    await models.UserFile.create({
      user_id: exampleUser.id,
      file_name: i + "-р файл",
      file_path: Math.floor(i * Math.random()),
      file_type: (i % 4) + "-р гэрчилгээ",
    });

    // Create a exampleSubject
    const exampleSubject = await models.Subject.create({
      subject_name: subjectNames[i],
      subject_code: subjectCodes[i],
      main_teacher_id: exampleUser.id,
      user_id: i % 2 == 0 ? 1 : 3,
    });

    // Additional teachers as assistant teachers

    var randomLessonTypeId1 =
      Math.floor(Math.random() * lessonTypeNames.length) + 1;

    await models.SubjectLessonType.create({
      subject_id: exampleSubject.id,
      lesson_type_id: randomLessonTypeId1, // Random lesson type
    });

    var randomLessonTypeId2 =
      Math.floor(Math.random() * lessonTypeNames.length) + 1;

    if (randomLessonTypeId1 != randomLessonTypeId2) {
      await models.SubjectLessonType.create({
        subject_id: exampleSubject.id,
        lesson_type_id: randomLessonTypeId2, // Random lesson type
      });
    }

    // Create a lesson type (assuming lesson types are predefined and have specific IDs)
    const exampleLessonType = await models.LessonType.findOne({
      where: { id: Math.floor(Math.random() * lessonTypeNames.length) + 1 },
      include: [
        {
          model: models.LessonAssessment,
        },
      ],
    });

    // await exampleUser.addSubject(exampleSubject);

    // await models.TeacherSubject.create({
    //   user_id: exampleUser.id,
    //   subject_id: exampleSubject.id,
    //   lesson_type_id: exampleLessonType.id,
    // });

    // Create a exampleSubject schedule
    const exampleSubjectSchedule = await models.SubjectSchedule.create({
      subject_id: exampleSubject.id,
      lesson_type_id: exampleLessonType.id,
      lecture_day: randomDataContainer.randomDay,
      lecture_time: randomDataContainer.randomTime,
    });

    // Create lessons
    for (let week = 1; week <= 16; week++) {
      if (exampleLessonType && exampleLessonType.lesson_assessments) {
        for (const assessment of exampleLessonType.lesson_assessments) {
          await models.Lesson.create({
            subject_id: exampleSubject.id,
            lesson_assessment_id: assessment.id,
            week_number: week,
            lesson_number: week,
          });
        }
      }
    }

    // Create a student
    const student = await models.Student.create({
      name: peopleNames[Math.floor(Math.random() * peopleNames.length)],
      student_code: studentCodes[i],
    });

    // Enroll student in the exampleSubject schedule (assuming this represents the student being allocated to a specific schedule)
    await models.StudentSubjectSchedule.create({
      student_id: student.id,
      subject_schedule_id: exampleSubjectSchedule.id,
    });

    const allLessons = await models.Lesson.findAll();

    for (const lesson of allLessons) {
      await models.Grade.create({
        student_id: student.id,
        lesson_id: lesson.id,
        grade: generateRandomGrade(MAX_GRADE),
      });
    }
  }

  await models.Semester.create({
    semester_code: "2024B - Хаврын улирал",
    start_date: new Date("2024-01-24"),
    is_active: true,
    user_id: 2,
  });

  await models.Menu.create({
    menu_code: "00",
    parent_id: 0,
    menu_name: "ХЯНАЛТ",
    router_link: "",
    sorted_order: 0,
    icon_name: "",
  });
  await models.Menu.create({
    menu_code: "01",
    parent_id: 0,
    menu_name: "ҮНДСЭН ХЭСЭГ",
    router_link: "",
    sorted_order: 1,
    icon_name: "",
  });
  await models.Menu.create({
    menu_code: "02",
    parent_id: 0,
    menu_name: "БҮРТГЭЛ",
    router_link: "",
    sorted_order: 2,
    icon_name: "",
  });

  await models.Menu.create({
    menu_code: "0001",
    parent_id: 1,
    menu_name: "Дашбоард",
    router_link: "/dashboard",
    sorted_order: 1,
    icon_name: "material-symbols:dashboard-outline",
  });
  await models.Menu.create({
    menu_code: "0101",
    parent_id: 2,
    menu_name: "Хичээл",
    router_link: "/dashboard/subject",
    sorted_order: 1,
    icon_name: "material-symbols-light:subject",
  });
  await models.Menu.create({
    menu_code: "0102",
    parent_id: 2,
    menu_name: "Хичээлийн задаргаа",
    router_link: "/dashboard/lessons",
    sorted_order: 2,
    icon_name: "material-symbols-light:subject",
  });
  await models.Menu.create({
    menu_code: "0103",
    parent_id: 2,
    menu_name: "Хичээл орох хэлбэр",
    router_link: "/dashboard/lessonTypes",
    sorted_order: 3,
    icon_name: "material-symbols-light:subject",
  });
  await models.Menu.create({
    menu_code: "0104",
    parent_id: 2,
    menu_name: "Дүнгийн задаргаа",
    router_link: "/dashboard/lessonAsses",
    sorted_order: 4,
    icon_name: "material-symbols-light:subject",
  });
  await models.Menu.create({
    menu_code: "0105",
    parent_id: 2,
    menu_name: "Оюутнууд",
    router_link: "/dashboard/students",
    sorted_order: 4,
    icon_name: "material-symbols-light:subject",
  });

  await models.Menu.create({
    menu_code: "0201",
    parent_id: 3,
    menu_name: "Хэрэглэгч",
    router_link: "/dashboard/users",
    sorted_order: 1,
    icon_name: "material-symbols-light:subject",
  });
  await models.Menu.create({
    menu_code: "0202",
    parent_id: 3,
    menu_name: "Хэрэглэгчийн бүлэг",
    router_link: "/dashboard/userRole",
    sorted_order: 2,
    icon_name: "material-symbols-light:subject",
  });
  await models.Menu.create({
    menu_code: "0203",
    parent_id: 3,
    menu_name: "Багшийн портфолио",
    router_link: "/dashboard/userFile",
    sorted_order: 3,
    icon_name: "material-symbols-light:subject",
  });

  const adminMenus = await models.Menu.findAll({
    where: {
      [Sequelize.Op.or]: [
        { menu_code: { [Sequelize.Op.like]: "00%" } },
        { menu_code: { [Sequelize.Op.like]: "01%" } },
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
        { menu_code: { [Sequelize.Op.like]: "00%" } },
        { menu_code: { [Sequelize.Op.like]: "01%" } },
      ],
    },
  });

  for (const teacherMenu of teacherMenus) {
    await models.UserRoleMenu.create({
      user_role_id: 2,
      menu_id: teacherMenu.id,
    });
  }

  await models.UserFile.create({
    user_id: 1,
    file_name: "1-р файл",
    file_path: Math.floor(Math.random()),
    file_type: "1-р гэрчилгээ",
  });
  await models.UserFile.create({
    user_id: 1,
    file_name: "2-р файл",
    file_path: Math.floor(Math.random()),
    file_type: "1-р гэрчилгээ",
  });

  
  const attendanceObject = await models.Attendance.create({
    lesson_id: 1,
    subject_schedule_id: 1,
    qr: "asdqw"
  });
  await models.AttendanceResponse.create({
    user_id: attendanceObject.id,
    submitted_name: "Мөнх-Очир",
    submitted_code: "B200910045",
    attendance_date: new Date()
  });
};

main();
