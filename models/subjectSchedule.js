const { Model, DataTypes } = require('sequelize');

class SubjectSchedule extends Model {
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
      lesson_type_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'lesson_type', // Make sure this matches your Subject model name
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
      modelName: 'subject_schedule',
      tableName: 'subject_schedule', 
      timestamps: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.Subject, { foreignKey: 'subject_id' });
    this.belongsTo(models.LessonType, { foreignKey: 'lesson_type_id' });
    // Make sure AttendanceResponse is a correct model and should be associated
    this.hasMany(models.AttendanceResponse, { foreignKey: 'subject_schedule_id' });
    this.hasMany(models.StudentSubjectSchedule, { foreignKey: 'subject_schedule_id' }); // Added based on your diagram
  }
}

module.exports = SubjectSchedule;
