const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelizeConfig"); // Adjust the path as needed

// Import models as classes
const AttendanceResponse = require("./attendanceResponse");
const Grade = require("./grade");
const Lesson = require("./lesson");
const LessonAssessment = require("./lessonAssessment");
const LessonType = require("./lessonType");
const Student = require("./student");
const StudentSubjectSchedule = require("./studentSubjectSchedule");
const Subject = require("./subject");
const SubjectSchedule = require("./subjectSchedule");
const Teacher = require("./teacher");
const TeacherFile = require("./teacherFile");
const TeacherRole = require("./teacherRole");
const TeachingAssignment = require('./teachingAssignment');

// Initialize models in order respecting foreign key dependencies
AttendanceResponse.init(sequelize, Sequelize.DataTypes);
Grade.init(sequelize, Sequelize.DataTypes);
Lesson.init(sequelize, Sequelize.DataTypes);
LessonType.init(sequelize, Sequelize.DataTypes);
LessonAssessment.init(sequelize, Sequelize.DataTypes);
Student.init(sequelize, Sequelize.DataTypes);
StudentSubjectSchedule.init(sequelize, Sequelize.DataTypes);
Subject.init(sequelize, Sequelize.DataTypes);
SubjectSchedule.init(sequelize, Sequelize.DataTypes);
Teacher.init(sequelize, Sequelize.DataTypes);
TeacherFile.init(sequelize, Sequelize.DataTypes);
TeacherRole.init(sequelize, Sequelize.DataTypes);
TeachingAssignment.init(sequelize, Sequelize.DataTypes);

// Set up associations
const models = {
  AttendanceResponse,
  Grade,
  Lesson,
  LessonAssessment,
  LessonType,
  Student,
  StudentSubjectSchedule,
  Subject,
  SubjectSchedule,
  Teacher,
  TeacherFile,
  TeacherRole,
  TeachingAssignment
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, Sequelize, ...models };
