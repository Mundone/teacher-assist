const { Model, DataTypes } = require("sequelize");

class Menu extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        menu_code: {
          type: DataTypes.STRING(255),
        },
        parent_id: {
          type: DataTypes.INTEGER,
        },
        menu_name: {
          type: DataTypes.STRING(255),
        },
        router_link: {
          type: DataTypes.STRING(255),
        },
        sorted_order: {
          type: DataTypes.INTEGER,
        },
        icon_name: {
          type: DataTypes.STRING(255),
        },
      },
      {
        sequelize,
        modelName: "menu",
        tableName: "menu",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.UserRoleMenu, {
      foreignKey: "menu_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }); // Added based on your diagram
  }
}

module.exports = Menu;
