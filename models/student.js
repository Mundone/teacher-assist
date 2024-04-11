const { Model, DataTypes } = require('sequelize');

class Student extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
      },
      student_code: {
        type: DataTypes.STRING(255),
      },
      email: {
        type: DataTypes.STRING(255),
      },
      password: {
        type: DataTypes.STRING,
      },
      // grade: {
      //   type: DataTypes.JSON,
      // },
    }, {
      sequelize,
      modelName: 'student',
      tableName: 'student', 
      timestamps: true,
    });
  }

  static associate(models) {
    this.hasMany(models.Grade, { foreignKey: 'student_id' });
    this.hasMany(models.StudentSubjectSchedule, { foreignKey: 'student_id' });
  }
}

module.exports = Student;

