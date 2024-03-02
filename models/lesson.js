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
            model: "subject", // Make sure this matches your Teacher model name
            key: "id",
          },
        },
        lesson_type_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "lesson_type", // Make sure this matches your Teacher model name
            key: "id",
          },
        },
        week_number: {
          type: DataTypes.INTEGER ,
        },
        lesson_number: {
          type: DataTypes.INTEGER ,
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
    this.belongsTo(models.Subject, { foreignKey: "subject_id" });
    this.belongsTo(models.LessonType, { foreignKey: "lesson_type_id" });
    this.hasMany(models.AttendanceResponse, {
      foreignKey: "lesson_id",
    });
    this.hasMany(models.Score, {
      foreignKey: "lesson_id",
    });
  }
}

module.exports = Lesson;
