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
  for (let i = 0; i < 10; i++) {
    const data = generateRandomData();
    
    const role = await models.TeacherRole.create({ RoleName: `Role${i}` });
    const teacher = await models.Teacher.create({ Name: data.randomName, RoleID: role.RoleID });
    const subject = await models.Subject.create({ SubjectName: `Subject${i}`, TeacherID: teacher.TeacherID });

    const lectureSchedule = await models.LectureSchedule.create({
      SubjectID: subject.SubjectID,
      LectureDay: data.randomDay,
      LectureTime: data.randomTime,
    });

    const labs = [];
    const assignments = [];
    for (let j = 0; j < data.randomNumber; j++) {
      const lab = await models.Lab.create({
        SubjectID: subject.SubjectID,
        LabDay: data.randomDay,
        LabTime: data.randomTime,
        MaxScore: MAX_LAB_SCORE,
        LabNumber: j + 1,
      });
      labs.push(lab);

      const assignment = await models.Assignment.create({
        SubjectID: subject.SubjectID,
        MaxScore: MAX_ASSIGNMENT_SCORE,
        AssignmentNumber: j + 1,
      });
      assignments.push(assignment);
    }

    const student = await models.Student.create({ Name: `Student${i}`, StudentCode: `Code${i}` });

    await models.StudentEnrollment.create({
      StudentID: student.StudentID,
      SubjectID: subject.SubjectID,
      LectureScheduleID: lectureSchedule.ScheduleID,
    });

    // Create Scores
    await models.Score.create({
      StudentID: student.StudentID,
      SubjectID: subject.SubjectID,
      LectureScores: JSON.stringify(generateRandomScores(16, 1)), // 16 weeks, score either 0 or 1
      LabScores: JSON.stringify(labs.map(lab => ({ labID: lab.LabID, score: generateRandomScore(lab.MaxScore) }))),
      LabAttendanceScores: JSON.stringify(generateRandomScores(labs.length, 1)), // Score either 0 or 1 for lab attendance
      AssignmentScores: JSON.stringify(assignments.map(assignment => ({ assignmentID: assignment.AssignmentID, score: generateRandomScore(assignment.MaxScore) }))),
      ExtraPoint: generateRandomScore(MAX_EXTRA_POINT),
    });

    await models.AttendanceRecord.create({
      StudentID: student.StudentID,
      SubjectID: subject.SubjectID,
      LectureScheduleID: lectureSchedule.ScheduleID,
      AttendanceDate: moment.utc().subtract(-8, "hours").toDate(),
      Attended: Math.random() < 0.5,
    });
  }
};

main();
