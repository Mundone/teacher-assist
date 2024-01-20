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
      },
      SubjectID: {
        type: DataTypes.INTEGER,
      },
      LectureScheduleID: {
        type: DataTypes.INTEGER,
      },
      LabScheduleID: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'StudentEnrollment',
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'StudentID' });
    this.belongsTo(models.Subject, { foreignKey: 'SubjectID' });
    this.belongsTo(models.LectureSchedule, { foreignKey: 'LectureScheduleID' });
    this.belongsTo(models.LabSchedule, { foreignKey: 'LabScheduleID' });
  }
}

module.exports = StudentEnrollment;
