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
    }, {
      sequelize,
      modelName: 'student',
      tableName: 'student', 
      timestamps: false,
    });
  }

  static associate(models) {
    this.hasMany(models.StudentEnrollment, { foreignKey: 'student_id' });
    this.hasMany(models.Score, { foreignKey: 'student_id' });
    this.hasMany(models.AttendanceRecord, { foreignKey: 'student_id' });
    // Add other associations here
  }
}

module.exports = Student;
