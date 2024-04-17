const { Model, DataTypes } = require("sequelize");

class Grade extends Model {
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
            model: "student", // Ensure this matches your Subject model name
            key: "id",
          },
        },
        lesson_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "lesson", // Make sure this matches your Subject model name
            key: "id",
          },
        },
        grade: {
          type: DataTypes.FLOAT,
        },
        distance: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        modelName: "grade",
        tableName: "grade",
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
    this.belongsTo(models.Lesson, {
      foreignKey: "lesson_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = Grade;
