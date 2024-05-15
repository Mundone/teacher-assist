const { Model, DataTypes } = require("sequelize");

class Survey extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        survey_title: {
          type: DataTypes.STRING(255),
        },
        description: {
          type: DataTypes.STRING(255),
        },
      },
      {
        sequelize,
        modelName: "survey",
        tableName: "survey",
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

    this.hasMany(models.Question, {
      foreignKey: "survey_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = Survey;
