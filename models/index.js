const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelizeConfig"); // Adjust the path as needed

// Import models as classes
const Attendance = require("./attendance");
const AttendanceResponse = require("./attendanceResponse");
const Grade = require("./grade");
const Lesson = require("./lesson");
const LessonAssessment = require("./lessonAssessment");
const LessonType = require("./lessonType");
const Menu = require("./menu");
const Schedule = require("./schedule");
const School = require("./school");
const Semester = require("./semester");
const Student = require("./student");
const StudentSubjectSchedule = require("./studentSubjectSchedule");
const Subject = require("./subject");
const SubjectSchedule = require("./subjectSchedule");
const SubSchool = require("./subSchool");
const User = require("./user");
const UserFile = require("./userFile");
const UserRoleMenu = require("./userRoleMenu");
const UserRole = require("./userRole");
const SubjectLessonType = require("./subjectLessonType");

// Initialize models in order respecting foreign key dependencies
Attendance.init(sequelize, Sequelize.DataTypes);
AttendanceResponse.init(sequelize, Sequelize.DataTypes);
Grade.init(sequelize, Sequelize.DataTypes);
Lesson.init(sequelize, Sequelize.DataTypes);
LessonType.init(sequelize, Sequelize.DataTypes);
Menu.init(sequelize, Sequelize.DataTypes);
LessonAssessment.init(sequelize, Sequelize.DataTypes);
Schedule.init(sequelize, Sequelize.DataTypes);
School.init(sequelize, Sequelize.DataTypes);
Semester.init(sequelize, Sequelize.DataTypes);
Student.init(sequelize, Sequelize.DataTypes);
StudentSubjectSchedule.init(sequelize, Sequelize.DataTypes);
Subject.init(sequelize, Sequelize.DataTypes);
SubjectSchedule.init(sequelize, Sequelize.DataTypes);
SubSchool.init(sequelize, Sequelize.DataTypes);
User.init(sequelize, Sequelize.DataTypes);
UserFile.init(sequelize, Sequelize.DataTypes);
UserRoleMenu.init(sequelize, Sequelize.DataTypes);
UserRole.init(sequelize, Sequelize.DataTypes);
SubjectLessonType.init(sequelize, Sequelize.DataTypes);

// Set up associations
const models = {
  Attendance,
  AttendanceResponse,
  Grade,
  Lesson,
  LessonAssessment,
  LessonType,
  Menu,
  Schedule,
  School,
  Semester,
  Student,
  StudentSubjectSchedule,
  Subject,
  SubjectSchedule,
  SubSchool,
  User,
  UserFile,
  UserRoleMenu,
  UserRole,
  SubjectLessonType,
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, Sequelize, ...models };
