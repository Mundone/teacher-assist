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
        main_teacher_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "user", // Make sure this matches your User model name
            key: "id",
          },
        },
        updatedBy: {
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
    // this.belongsTo(models.User, {
    //   foreignKey: "main_teacher_id",
    //   as: "MainTeacher", // Alias added here
    // });
    
    this.belongsTo(models.User, { foreignKey: "user_id" });

    this.hasMany(models.Lesson, {
      foreignKey: "subject_id",
    });
    this.hasMany(models.SubjectSchedule, {
      foreignKey: "subject_id",
    });

    this.hasMany(models.SubjectLessonType, { foreignKey: "subject_id" });
  }
}

module.exports = Subject;
