const { Model, DataTypes } = require("sequelize");

class SubjectSchedule extends Model {
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
            model: "subject", // Make sure this matches your Subject model name
            key: "id",
          },
        },
        lesson_type_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "lesson_type", // Make sure this matches your Subject model name
            key: "id",
          },
        },
        schedule_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "schedule", // Make sure this matches your Subject model name
            key: "id",
          },
        },
      },
      {
        sequelize,
        modelName: "subject_schedule",
        tableName: "subject_schedule",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Subject, { foreignKey: "subject_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE", });
    this.belongsTo(models.LessonType, { foreignKey: "lesson_type_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE", });
    this.hasMany(models.Attendance, { foreignKey: "subject_schedule_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE", });
    this.hasMany(models.StudentSubjectSchedule, {
      foreignKey: "subject_schedule_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    this.belongsTo(models.Schedule, { foreignKey: "schedule_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE", });
  }
}

module.exports = SubjectSchedule;
