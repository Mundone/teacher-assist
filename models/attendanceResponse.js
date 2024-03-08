const { Model, DataTypes } = require('sequelize');

class AttendanceResponse extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'lesson', // Ensure this matches your Subject model name
          key: 'id',
        },
      },
      subject_schedule_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'subject_schedule', // Ensure this matches your Subject model name
          key: 'id',
        },
      },
      submitted_name: {
        type: DataTypes.STRING(255),
      },
      submitted_code: {
        type: DataTypes.STRING(255),
      },
      attendance_date: {
        type: DataTypes.DATE,
      },
    }, {
      sequelize,
      modelName: 'attendance_record',
      tableName: 'attendance_record', 
      timestamps: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.Lesson, { foreignKey: 'lesson_id' });
    this.belongsTo(models.SubjectSchedule, { foreignKey: 'subject_schedule_id' });
  }
}

module.exports = AttendanceResponse;
