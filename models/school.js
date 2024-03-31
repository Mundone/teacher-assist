const { Model, DataTypes } = require("sequelize");

class School extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        school_name: {
          type: DataTypes.STRING(255),
        },
        is_active: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        sequelize,
        modelName: "school",
        tableName: "school",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.User, {
      foreignKey: "school_id",
    });
    this.hasMany(models.SubSchool, {
      foreignKey: "school_id",
    });
  }
}

module.exports = School;
