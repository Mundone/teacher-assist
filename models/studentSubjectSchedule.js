const { Model, DataTypes } = require('sequelize');

class StudentSubjectSchedule extends Model {
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
          model: 'student', // Make sure this matches your Student model name
          key: 'id',
        },
      },
      subject_schedule_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'subject_schedule', // Make sure this matches your Subject model name
          key: 'id',
        },
      },
    }, {
      sequelize,
      modelName: 'student_subject_schedule',
      tableName: 'student_subject_schedule', 
      timestamps: false, // Cons_ider if you need timestamps
    });
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' }); // Corrected to belongsTo
    this.belongsTo(models.SubjectSchedule, { foreignKey: 'subject_schedule_id' }); // Corrected to belongsTo
  }
}

module.exports = StudentSubjectSchedule;
