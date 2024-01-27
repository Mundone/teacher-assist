const models = require("./models/index");
const moment = require("moment-timezone");
const sequelize = require("./config/sequelizeConfig");

const MAX_LAB_SCORE = 3;
const MAX_ASSIGNMENT_SCORE = 20;
const MAX_EXTRA_POINT = 10;

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

// Helper functions to generate random data
const generateRandomData = () => {
  const randomName = `Name${Math.floor(Math.random() * 100)}`;
  const randomDay = Math.floor(Math.random() * 7) + 1;
  const randomTime = Math.floor(Math.random() * 10) + 1;
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  return { randomName, randomDay, randomTime, randomNumber };
};

const generateRandomScore = (maxScore) => Math.floor(Math.random() * (maxScore + 1));
const generateRandomScores = (count, maxScore) => Array.from({ length: count }, () => generateRandomScore(maxScore));


const insertRandomData = async () => {
  const role = await models.TeacherRole.create({ role_name: `Багш` });
  await models.TeacherRole.create({ role_name: `Ахлах багш` });
  await models.TeacherRole.create({ role_name: `Салбарын эрхлэгч` });
  for (let i = 0; i < 2; i++) {
    const data = generateRandomData();
    
    const teacher = await models.Teacher.create({ code: `Code${data.randomName}`, name: data.randomName, role_id: role.id });
    const subject = await models.Subject.create({ subject_name: `Subject${i}`, teacher_id: teacher.TeacherID });

    const lectureSchedule = await models.LectureSchedule.create({
      subject_id: subject.id,
      lecture_day: data.randomDay,
      lecture_time: data.randomTime,
    });

    const labs = [];
    const assignments = [];
    for (let j = 0; j < data.randomNumber; j++) {
      const lab = await models.Lab.create({
        subject_id: subject.id,
        lab_day: data.randomDay,
        lab_time: data.randomTime,
        max_score: MAX_LAB_SCORE,
        lab_number: j + 1,
      });
      labs.push(lab);

      const assignment = await models.Assignment.create({
        subject_id: subject.id,
        max_score: MAX_ASSIGNMENT_SCORE,
        assignment_number: j + 1,
      });
      assignments.push(assignment);
    }

    const student = await models.Student.create({ name: `Student${i}`, student_code: `Code${i}` });

    await models.StudentEnrollment.create({
      student_id: student.id,
      subject_id: subject.id,
      lecture_schedule_id: lectureSchedule.ScheduleID,
    });

    // Create Scores
    await models.Score.create({
      student_id: student.id,
      subject_id: 1,
      lecture_scores: JSON.stringify(generateRandomScores(16, 1)), // 16 weeks, score either 0 or 1
      lab_scores: JSON.stringify(labs.map(lab => ({ lab_id: lab.id, score: generateRandomScore(lab.max_score) }))),
      lab_attendance_scores: JSON.stringify(generateRandomScores(labs.length, 1)), // Score either 0 or 1 for lab attendance
      assignment_scores: JSON.stringify(assignments.map(assignment => ({ assignment_id: assignment.id, score: generateRandomScore(assignment.max_score) }))),
      extra_point: generateRandomScore(MAX_EXTRA_POINT),
    });

    await models.AttendanceRecord.create({
      student_id: student.id,
      subject_id: subject.id,
      lecture_schedule_id: lectureSchedule.id,
      attendance_date: moment.utc().subtract(-8, "hours").toDate(),
      attended: Math.random() < 0.5,
    });
  }
};

main();
