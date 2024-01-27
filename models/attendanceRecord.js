const { Model, DataTypes } = require('sequelize');

class AttendanceRecord extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'student', // Ensure this matches your Subject model name
          key: 'id',
        },
      },
      subject_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'subject', // Ensure this matches your Subject model name
          key: 'id',
        },
      },
      lecture_schedule_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'lecture_schedule', // Ensure this matches your Subject model name
          key: 'id',
        },
      },
      attendance_date: {
        type: DataTypes.DATE,
      },
      attended: {
        type: DataTypes.BOOLEAN,
      },
    }, {
      sequelize,
      modelName: 'attendance_record',
      tableName: 'attendance_record', 
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.Subject, { foreignKey: 'subject_id' });
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
    this.belongsTo(models.LectureSchedule, { foreignKey: 'lecture_schedule_id' });
  }
}

module.exports = AttendanceRecord;
