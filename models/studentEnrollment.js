const { Model, DataTypes } = require('sequelize');

class StudentEnrollment extends Model {
  static init(sequelize) {
    super.init({
      EnrollmentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      StudentID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Students', // Make sure this matches your Student model name
          key: 'StudentID',
        },
      },
      SubjectID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Subjects', // Make sure this matches your Subject model name
          key: 'SubjectID',
        },
      },
      LectureScheduleID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'LectureSchedules', // Make sure this matches your LectureSchedule model name
          key: 'ScheduleID',
        },
      },
      // LabScheduleID field is removed
    }, {
      sequelize,
      modelName: 'StudentEnrollment',
      tableName: 'StudentEnrollments', 
      timestamps: false, // Consider if you need timestamps
    });
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'StudentID' });
    this.belongsTo(models.Subject, { foreignKey: 'SubjectID' });
    this.belongsTo(models.LectureSchedule, { foreignKey: 'LectureScheduleID' });
    // Lab association if needed, replace with relevant field from the Lab model
    // Example: this.belongsTo(models.Lab, { foreignKey: 'LabID' });
  }
}

module.exports = StudentEnrollment;
