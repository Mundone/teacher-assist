const { Model, DataTypes } = require('sequelize');

class UserRole extends Model {
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
      modelName: 'user_role',
      tableName: 'user_role', 
      timestamps: true,
    });
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: 'role_id' });
    this.hasMany(models.UserRoleMenu, { foreignKey: "user_role_id" });
  }
}

module.exports = UserRole;
