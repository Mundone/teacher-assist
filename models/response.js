const { Model, DataTypes } = require("sequelize");

class Response extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        student_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "student",
            key: "id",
          },
        },
        question_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "question",
            key: "id",
          },
        },
        answer_text: {
          type: DataTypes.STRING(255),
        },
        answer_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "offered_answer",
            key: "id",
          },
        },
      },
      {
        sequelize,
        modelName: "response",
        tableName: "response",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: "student_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.belongsTo(models.Question, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.belongsTo(models.OfferedAnswer, {
      foreignKey: "answer_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = Response;
