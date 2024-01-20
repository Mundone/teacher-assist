const models = require("./models/index");
const moment = require("moment-timezone");
const sequelize = require("./config/sequelizeConfig");

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

//Functions
const generateRandomData = () => {
  const randomName = `Name-${Math.random().toString(36).substring(7)}`;
  const randomDay = Math.floor(Math.random() * 7) + 1;
  const randomTime = Math.floor(Math.random() * 24);
  const randomScore = Math.floor(Math.random() * 100);
  const randomBoolean = Math.random() < 0.5;

  return { randomName, randomDay, randomTime, randomScore, randomBoolean };
};

const insertRandomData = async () => {
  // Insert roles, teachers, subjects, etc.
  for (let i = 0; i < 10; i++) {
    const { randomName, randomDay, randomTime, randomScore, randomBoolean } = generateRandomData();

    // Inserting into TeacherRole, Teacher, Subject, etc.
    const role = await models.TeacherRole.create({ RoleName: `Role-${i}` });
    const teacher = await models.Teacher.create({ Name: randomName, RoleID: role.RoleID });

    const subject = await models.Subject.create({ SubjectName: `Subject-${i}`, TeacherID: teacher.TeacherID });

    const lectureSchedule = await models.LectureSchedule.create({
      SubjectID: subject.SubjectID,
      LectureDay: randomDay,
      LectureTime: randomTime,
    });

    const labSchedule = await models.LabSchedule.create({
      SubjectID: subject.SubjectID,
      LabDay: randomDay,
      LabTime: randomTime,
    });

    const student = await models.Student.create({ Name: randomName, StudentCode: `Code-${i}` });

    await models.StudentEnrollment.create({
      StudentID: student.StudentID,
      SubjectID: subject.SubjectID,
      LectureScheduleID: lectureSchedule.ScheduleID,
      LabScheduleID: labSchedule.ScheduleID,
    });

    await models.Score.create({
      StudentID: student.StudentID,
      SubjectID: subject.SubjectID,
      LectureScores: JSON.stringify([{ week: 1, score: randomScore }]),
      LabScores: JSON.stringify([{ week: 1, score: randomScore }]),
      LabAttendanceScores: JSON.stringify([{ week: 1, score: randomScore }]),
      AssignmentScores: JSON.stringify([{ assignment: 1, score: randomScore }]),
      ExtraPoint: randomScore,
    });

    await models.AttendanceRecord.create({
      StudentID: student.StudentID,
      SubjectID: subject.SubjectID,
      LectureScheduleID: lectureSchedule.ScheduleID,
      AttendanceDate: moment.utc().subtract(-8, "hours").toDate(),
      Attended: randomBoolean,
    });
  }
};

main();
