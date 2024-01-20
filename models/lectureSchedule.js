const { Model, DataTypes } = require('sequelize');

class LectureSchedule extends Model {
  static init(sequelize) {
    super.init({
      ScheduleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SubjectID: {
        type: DataTypes.INTEGER,
      },
      LectureDay: {
        type: DataTypes.INTEGER,
      },
      LectureTime: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'LectureSchedule',
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.Subject, { foreignKey: 'SubjectID' });
    this.hasMany(models.AttendanceRecord, { foreignKey: 'LectureScheduleID' });
  }
}

module.exports = LectureSchedule;
