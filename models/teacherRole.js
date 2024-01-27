const { Model, DataTypes } = require('sequelize');

class TeacherRole extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
        type: DataTypes.STRING(255),
      },
    }, {
      sequelize,
      modelName: 'teacher_role',
      tableName: 'teacher_role', 
      timestamps: false,
    });
  }

  static associate(models) {
    this.hasMany(models.Teacher, { foreignKey: 'role_id' });
  }
}

module.exports = TeacherRole;
