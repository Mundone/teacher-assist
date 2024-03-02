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
      // score: {
      //   type: DataTypes.JSON,
      // },
    }, {
      sequelize,
      modelName: 'student',
      tableName: 'student', 
      timestamps: false,
    });
  }

  static associate(models) {
    this.hasMany(models.Score, { foreignKey: 'student_id' });
  }
}

module.exports = Student;

