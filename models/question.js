const { Model, DataTypes } = require("sequelize");

class Question extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        survey_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "survey",
            key: "id",
          },
        },
        order_no: {
          type: DataTypes.INTEGER,
        },
        question_text: {
          type: DataTypes.STRING(255),
        },
        placeholder: {
          type: DataTypes.STRING(255),
        },
        type: {
          type: DataTypes.ENUM('single_selection', 'multiple_selection', 'free_text'),
        },
      },
      {
        sequelize,
        modelName: "question",
        tableName: "question",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Survey, {
      foreignKey: "survey_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.hasMany(models.OfferedAnswer, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.hasMany(models.Response, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = Question;
