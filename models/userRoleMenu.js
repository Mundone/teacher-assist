const { Model, DataTypes } = require("sequelize");

class UserRoleMenu extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_role_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "user_role", // Make sure this matches your UserRole model name
            key: "id",
          },
        },
        menu_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "menu", // Make sure this matches your Subject model name
            key: "id",
          },
        },
      },
      {
        sequelize,
        modelName: "user_role_menu",
        tableName: "user_role_menu",
        timestamps: false, // Cons_ider if you need timestamps
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.UserRole, {
      foreignKey: "user_role_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    this.belongsTo(models.Menu, {
      foreignKey: "menu_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = UserRoleMenu;
