const { Model, DataTypes } = require('sequelize');

class AttendanceRecord extends Model {
  static init(sequelize) {
    super.init({
      AttendanceID: {
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
      AttendanceDate: {
        type: DataTypes.DATE,
      },
      Attended: {
        type: DataTypes.BOOLEAN,
      },
    }, {
      sequelize,
      modelName: 'AttendanceRecord',
      tableName: 'AttendanceRecords', 
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.Subject, { foreignKey: 'SubjectID' });
    this.belongsTo(models.Student, { foreignKey: 'StudentID' });
    this.belongsTo(models.LectureSchedule, { foreignKey: 'LectureScheduleID' });
  }
}

module.exports = AttendanceRecord;
