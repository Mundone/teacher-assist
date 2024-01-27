const { Model, DataTypes } = require('sequelize');

class StudentEnrollment extends Model {
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
      subject_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'subject', // Make sure this matches your Subject model name
          key: 'id',
        },
      },
      lecture_schedule_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'lecture_schedule', // Make sure this matches your LectureSchedule model name
          key: 'id',
        },
      },
      // LabSchedule_id field is removed
    }, {
      sequelize,
      modelName: 'student_enrollment',
      tableName: 'student_enrollment', 
      timestamps: false, // Cons_ider if you need timestamps
    });
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
    this.belongsTo(models.Subject, { foreignKey: 'subject_id' });
    this.belongsTo(models.LectureSchedule, { foreignKey: 'lecture_schedule_id' });
    // Lab association if needed, replace with relevant field from the Lab model
    // Example: this.belongsTo(models.Lab, { foreignKey: 'Lab_id' });
  }
}

module.exports = StudentEnrollment;
