const { Model, DataTypes } = require("sequelize");

class Attendance extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        lesson_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "lesson", // Ensure this matches your Subject model name
            key: "id",
          },
        },
        subject_schedule_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "subject_schedule", // Ensure this matches your Subject model name
            key: "id",
          },
        },
        qr_code: {
          type: DataTypes.TEXT,
        },
        attendance_url_path: {
          type: DataTypes.STRING(255),
        },
        response_url_path: {
          type: DataTypes.STRING(255),
        },
        is_active: {
          type: DataTypes.BOOLEAN,
        },
        expired_at: {
          type: DataTypes.DATE,
        },
        usage_count: {
          type: DataTypes.INTEGER,
        },
        latitude: {
          type: DataTypes.STRING(255),
        },
        longitude: {
          type: DataTypes.STRING(255),
        },
        duration: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        modelName: "attendance",
        tableName: "attendance",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.AttendanceResponse, {
      foreignKey: "attendance_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    this.belongsTo(models.SubjectSchedule, {
      foreignKey: "subject_schedule_id",
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

module.exports = Attendance;
