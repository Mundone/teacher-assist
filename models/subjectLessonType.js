const { Model, DataTypes } = require("sequelize");

class SubjectLessonType extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        subject_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "subject",
            key: "id",
          },
        },
        lesson_type_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "lesson_type",
            key: "id",
          },
        },
        lesson_count: {
          type: DataTypes.INTEGER,
        },
        max_score: {
          type: DataTypes.FLOAT,
        },
      },
      {
        sequelize,
        modelName: "SubjectLessonType", // Change the modelName to match the class name
        tableName: "subject_lesson_type", // define the table name if it's different from the modelName
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Subject, {
      foreignKey: "subject_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    this.belongsTo(models.LessonType, {
      foreignKey: "lesson_type_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = SubjectLessonType;
