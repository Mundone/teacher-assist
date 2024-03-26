const { Model, DataTypes } = require("sequelize");

class Subject extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        subject_name: {
          type: DataTypes.STRING(255),
        },
        subject_code: {
          type: DataTypes.STRING(255),
        },
        isStarted: {
          type: DataTypes.BOOLEAN,
        },
        updated_by: {
          type: DataTypes.INTEGER,
          references: {
            model: "user",
            key: "id",
          },
        },
      },
      {
        sequelize,
        modelName: "subject",
        tableName: "subject",
        timestamps: true, // Consider if you need timestamps
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id" });

    this.hasMany(models.Lesson, {
      foreignKey: "subject_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    this.hasMany(models.SubjectSchedule, {
      foreignKey: "subject_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.hasMany(models.SubjectLessonType, {
      foreignKey: "subject_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = Subject;
