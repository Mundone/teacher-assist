const { Model, DataTypes } = require("sequelize");

class OfferedAnswer extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        question_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "question",
            key: "id",
          },
        },
        order_no: {
          type: DataTypes.INTEGER,
        },
        value: {
          type: DataTypes.STRING(255),
        },
      },
      {
        sequelize,
        modelName: "offered_answer",
        tableName: "offered_answer",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Question, {
      foreignKey: "question_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = OfferedAnswer;
