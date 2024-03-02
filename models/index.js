const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelizeConfig"); // Adjust the path as needed

// Import models as classes
const AttendanceResponse = require("./attendanceResponse");
const Lesson = require("./lesson");
const LessonType = require("./lessonType");
const Score = require("./score");
const Student = require("./student");
const StudentSubjectSchedule = require("./studentSubjectSchedule");
const Subject = require("./subject");
const SubjectSchedule = require("./subjectSchedule");
const Teacher = require("./teacher");
const TeacherFile = require("./teacherFile");
const TeacherRole = require("./teacherRole");
const TeacherSubject = require('./teacherSubject');

// Initialize models in order respecting foreign key dependencies
AttendanceResponse.init(sequelize, Sequelize.DataTypes);
Lesson.init(sequelize, Sequelize.DataTypes);
LessonType.init(sequelize, Sequelize.DataTypes);
Score.init(sequelize, Sequelize.DataTypes);
Student.init(sequelize, Sequelize.DataTypes);
StudentSubjectSchedule.init(sequelize, Sequelize.DataTypes);
Subject.init(sequelize, Sequelize.DataTypes);
SubjectSchedule.init(sequelize, Sequelize.DataTypes);
Teacher.init(sequelize, Sequelize.DataTypes);
TeacherFile.init(sequelize, Sequelize.DataTypes);
TeacherRole.init(sequelize, Sequelize.DataTypes);
TeacherSubject.init(sequelize, Sequelize.DataTypes);

// Set up associations
const models = {
  AttendanceResponse,
  Lesson,
  LessonType,
  Score,
  Student,
  StudentSubjectSchedule,
  Subject,
  SubjectSchedule,
  Teacher,
  TeacherFile,
  TeacherRole,
  TeacherSubject
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, Sequelize, ...models };
