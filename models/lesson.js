const { Model, DataTypes } = require("sequelize");

class Lesson extends Model {
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
        lesson_assessment_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "lesson_assessment",
            key: "id",
          },
        },
        week_number: {
          type: DataTypes.INTEGER,
        },
        lesson_number: {
          type: DataTypes.INTEGER,
        },
        convert_grade: {
          type: DataTypes.FLOAT,
        },
      },
      {
        sequelize,
        modelName: "lesson",
        tableName: "lesson",
        timestamps: true, // Consider if you need timestamps
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.LessonType, { foreignKey: "lesson_type_id" });
    this.belongsTo(models.Subject, { foreignKey: "subject_id" });
    this.belongsTo(models.LessonAssessment, {
      foreignKey: "lesson_assessment_id",
    });
    this.hasMany(models.Attendance, {
      foreignKey: "lesson_id",
    });
    this.hasMany(models.Grade, {
      foreignKey: "lesson_id",
    });
  }
}

module.exports = Lesson;
