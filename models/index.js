const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelizeConfig"); // Adjust the path as needed

// Import models as classes
const TeacherRole = require("./teacherRole");
const Teacher = require("./teacher");
const Subject = require("./subject");
const LectureSchedule = require("./lectureSchedule");
const Lab = require("./lab");
const Assignment = require("./assignment"); // Ensure you have an Assignment model
const Student = require("./student");
const StudentEnrollment = require("./studentEnrollment");
const Score = require("./score");
const AttendanceRecord = require("./attendanceRecord");
const TeacherFile = require("./teacherFile");

// Initialize models in order respecting foreign key dependencies
TeacherRole.init(sequelize, Sequelize.DataTypes);
Teacher.init(sequelize, Sequelize.DataTypes);
Subject.init(sequelize, Sequelize.DataTypes);
LectureSchedule.init(sequelize, Sequelize.DataTypes);
Lab.init(sequelize, Sequelize.DataTypes);
Assignment.init(sequelize, Sequelize.DataTypes);
Student.init(sequelize, Sequelize.DataTypes);
StudentEnrollment.init(sequelize, Sequelize.DataTypes);
Score.init(sequelize, Sequelize.DataTypes);
AttendanceRecord.init(sequelize, Sequelize.DataTypes);
TeacherFile.init(sequelize, Sequelize.DataTypes);

// Set up associations
const models = {
  TeacherRole,
  Teacher,
  Subject,
  LectureSchedule,
  Lab,
  Assignment,
  Student,
  StudentEnrollment,
  Score,
  AttendanceRecord,
  TeacherFile,
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, Sequelize, ...models };
