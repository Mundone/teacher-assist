const { Model, DataTypes } = require("sequelize");

class Semester extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        semester_code: {
          type: DataTypes.STRING(255),
        },
        start_date: {
          type: DataTypes.DATE,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
        },
        user_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "user",
            key: "id",
          },
        },
      },
      {
        sequelize,
        modelName: "semester",
        tableName: "semester",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = Semester;
