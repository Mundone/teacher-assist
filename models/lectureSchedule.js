const { Model, DataTypes } = require('sequelize');

class LectureSchedule extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'subject', // Make sure this matches your Subject model name
          key: 'id',
        },
      },
      lecture_day: {
        type: DataTypes.INTEGER,
      },
      lecture_time: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'lectureSchedule',
      tableName: 'lecture_schedule', 
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.Subject, { foreignKey: 'subject_id' });
    this.hasMany(models.AttendanceRecord, { foreignKey: 'lecture_schedule_id' });
  }
}

module.exports = LectureSchedule;
