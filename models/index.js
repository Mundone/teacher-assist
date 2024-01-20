const { Sequelize } = require("sequelize");
const config = require("../config/config"); // Adjust the path as needed

const sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
  host: config.database.host,
  dialect: config.database.dialect,
});

// Import models as classes
const AttendanceRecord = require("./attendanceRecord");
const LabSchedule = require("./labSchedule");
const LectureSchedule = require("./lectureSchedule");
const Teacher = require("./teacher");
const TeacherFile = require("./teacherFile");
const TeacherRole = require("./teacherRole");
const Score = require("./score");
const Student = require("./student");
const StudentEnrollment = require("./studentEnrollment");
const Subject = require("./subject");

// Initialize models
AttendanceRecord.init(sequelize, Sequelize.DataTypes);
LabSchedule.init(sequelize, Sequelize.DataTypes);
LectureSchedule.init(sequelize, Sequelize.DataTypes);
Teacher.init(sequelize, Sequelize.DataTypes);
TeacherFile.init(sequelize, Sequelize.DataTypes);
TeacherRole.init(sequelize, Sequelize.DataTypes);
Score.init(sequelize, Sequelize.DataTypes);
Student.init(sequelize, Sequelize.DataTypes);
StudentEnrollment.init(sequelize, Sequelize.DataTypes);
Subject.init(sequelize, Sequelize.DataTypes);

// Set up associations
const models = {
  AttendanceRecord,
  LabSchedule,
  LectureSchedule,
  Teacher,
  TeacherFile,
  TeacherRole,
  Score,
  Student,
  StudentEnrollment,
  Subject,
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, Sequelize, ...models };
