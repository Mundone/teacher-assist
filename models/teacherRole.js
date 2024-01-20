const { Model, DataTypes } = require('sequelize');

class TeacherRole extends Model {
  static init(sequelize) {
    super.init({
      RoleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      RoleName: {
        type: DataTypes.STRING(255),
      },
    }, {
      sequelize,
      modelName: 'TeacherRole',
      timestamps: false,
    });
  }

  static associate(models) {
    this.hasMany(models.Teacher, { foreignKey: 'RoleID' });
  }
}

module.exports = TeacherRole;
