const { Model, DataTypes } = require('sequelize');

class Student extends Model {
  static init(sequelize) {
    super.init({
      StudentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING(255),
      },
      StudentCode: {
        type: DataTypes.STRING(255),
      },
    }, {
      sequelize,
      modelName: 'Student',
      tableName: 'Students', 
      timestamps: false,
    });
  }

  static associate(models) {
    this.hasMany(models.StudentEnrollment, { foreignKey: 'StudentID' });
    this.hasMany(models.Score, { foreignKey: 'StudentID' });
    this.hasMany(models.AttendanceRecord, { foreignKey: 'StudentID' });
    // Add other associations here
  }
}

module.exports = Student;
