const models = require("./models/index");
const moment = require("moment-timezone");
const sequelize = require("./config/sequelizeConfig");

// const MAX_LAB_SCORE = 3;
// const MAX_ASSIGNMENT_SCORE = 20;
// const MAX_EXTRA_POINT = 10;

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

// // Helper functions to generate random data
// const generateRandomData = () => {
//   const randomName = `Name${Math.floor(Math.random() * 100)}`;
//   const randomDay = Math.floor(Math.random() * 7) + 1;
//   const randomTime = Math.floor(Math.random() * 10) + 1;
//   const randomNumber = Math.floor(Math.random() * 10) + 1;
//   return { randomName, randomDay, randomTime, randomNumber };
// };

// const generateRandomScore = (maxScore) => Math.floor(Math.random() * (maxScore + 1));
// const generateRandomScores = (count, maxScore) => Array.from({ length: count }, () => generateRandomScore(maxScore));

// const insertRandomData = async () => {
//   const exampleRole = await models.TeacherRole.create({ role_name: `Багш` });
//   await models.TeacherRole.create({ role_name: `Ахлах багш` });
//   await models.TeacherRole.create({ role_name: `Салбарын эрхлэгч` });
//   for (let i = 0; i < 2; i++) {
//     const data = generateRandomData();

//     const teacher = await models.Teacher.create({ code: `Code${data.randomName}`, name: data.randomName, role_id: exampleRole.id });
//     const subject = await models.Subject.create({ subject_name: `Subject${i}`, teacher_id: teacher.TeacherID });

//     const lectureSchedule = await models.LectureSchedule.create({
//       subject_id: subject.id,
//       lecture_day: data.randomDay,
//       lecture_time: data.randomTime,
//     });

//     const labs = [];
//     const assignments = [];
//     for (let j = 0; j < data.randomNumber; j++) {
//       const lab = await models.Lab.create({
//         subject_id: subject.id,
//         lab_day: data.randomDay,
//         lab_time: data.randomTime,
//         max_score: MAX_LAB_SCORE,
//         lab_number: j + 1,
//       });
//       labs.push(lab);

//       const assignment = await models.Assignment.create({
//         subject_id: subject.id,
//         max_score: MAX_ASSIGNMENT_SCORE,
//         assignment_number: j + 1,
//       });
//       assignments.push(assignment);
//     }

//     const student = await models.Student.create({ name: `Student${i}`, student_code: `Code${i}` });

//     await models.StudentEnrollment.create({
//       student_id: student.id,
//       subject_id: subject.id,
//       lecture_schedule_id: lectureSchedule.ScheduleID,
//     });

//     // Create Scores
//     await models.Score.create({
//       student_id: student.id,
//       subject_id: 1,
//       lecture_scores: JSON.stringify(generateRandomScores(16, 1)), // 16 weeks, score either 0 or 1
//       lab_scores: JSON.stringify(labs.map(lab => ({ lab_id: lab.id, score: generateRandomScore(lab.max_score) }))),
//       lab_attendance_scores: JSON.stringify(generateRandomScores(labs.length, 1)), // Score either 0 or 1 for lab attendance
//       assignment_scores: JSON.stringify(assignments.map(assignment => ({ assignment_id: assignment.id, score: generateRandomScore(assignment.max_score) }))),
//       extra_point: generateRandomScore(MAX_EXTRA_POINT),
//     });

//     await models.AttendanceRecord.create({
//       student_id: student.id,
//       subject_id: subject.id,
//       lecture_schedule_id: lectureSchedule.id,
//       attendance_date: moment.utc().subtract(-8, "hours").toDate(),
//       attended: Math.random() < 0.5,
//     });
//   }
// };

const MAX_SCORE = 10;

const generateRandomData = () => {
  const randomDay = Math.floor(Math.random() * 7) + 1; // Day of the week, 1 (Monday) - 7 (Sunday)
  const randomTime = Math.floor(Math.random() * 10) + 1; // Assuming time slots are numbered
  return { randomDay, randomTime };
};

const generateRandomScore = (maxScore) =>
  Math.floor(Math.random() * (maxScore + 1));

const insertRandomData = async () => {
  //teacherRole
  const exampleRole = await models.TeacherRole.create({ role_name: "Багш" });
  await models.TeacherRole.create({ role_name: "Ахлах багш" });
  await models.TeacherRole.create({ role_name: "Салбарын эрхлэгч" });

  for (let i = 0; i < lessonTypeNames.length; i++) {
    await models.LessonType.create({ lesson_type_name: lessonTypeNames[i] });
  }

  for (let i = 0; i < 10; i++) {
    const randomDataContainer = generateRandomData();

    // Create a teacher
    const teacher = await models.Teacher.create({
      name: peopleNames[i],
      email: peopleNamesEn[i] + "@must.com",
      code: teacherCodes[i],
      // Assume role_id is set correctly
      role_id: exampleRole.id,
    });

    // Create a subject
    const subject = await models.Subject.create({
      subject_name: subjectNames[i],
      // teacher_id: teacher.id,
    });

    await teacher.addSubject(subject);

    const nextTeacher = await models.Teacher.findOne({
      where: { id: i + 1 },
    });
    if(nextTeacher != null){
      await nextTeacher.addSubject(subject);
    }

    // Create a lesson type (assuming lesson types are predefined and have specific IDs)
    const lessonType = await models.LessonType.findOne({
      where: { id: Math.floor(Math.random() * lessonTypeNames.length) + 1 },
    });

    // Create a subject schedule
    const subjectSchedule = await models.SubjectSchedule.create({
      subject_id: subject.id,
      lesson_type_id: lessonType.id,
      lecture_day: randomDataContainer.randomDay,
      lecture_time: randomDataContainer.randomTime,
    });

    // Create lessons
    for (let week = 1; week <= 16; week++) {
      await models.Lesson.create({
        subject_id: subject.id,
        lesson_type_id: lessonType.id,
        week_number: week,
        lesson_number: week, // Assuming lesson number is the same as week number for simplicity
      });
    }

    // Create a student
    const student = await models.Student.create({
      name: peopleNames[Math.floor(Math.random() * peopleNames.length)],
      student_code: studentCodes[i],
    });

    // Enroll student in the subject schedule (assuming this represents the student being allocated to a specific schedule)
    await models.StudentSubjectSchedule.create({
      student_id: student.id,
      subject_schedule_id: subjectSchedule.id,
    });

    // Create scores for each lesson (assuming 16 lessons, one per week)
    for (let lessonId = 1; lessonId <= 16; lessonId++) {
      await models.Score.create({
        student_id: student.id,
        lesson_id: lessonId,
        score: generateRandomScore(MAX_SCORE), // Assuming a score out of MAX_SCORE
      });
    }
  }
};

main();
