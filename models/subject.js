const { Model, DataTypes } = require("sequelize");

class Subject extends Model {
  static init(sequelize) {
    super.init(
      {
        SubjectID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        SubjectName: {
          type: DataTypes.STRING(255),
        },
        TeacherID: {
          type: DataTypes.INTEGER,
          references: {
            model: "Teachers", // Make sure this matches your Teacher model name
            key: "TeacherID",
          },
        },
      },
      {
        sequelize,
        modelName: "Subject",
        tableName: "Subjects",
        timestamps: true, // Consider if you need timestamps
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Teacher, { foreignKey: "TeacherID" });
    this.hasMany(models.LectureSchedule, {
      foreignKey: "SubjectID",
      as: "LectureSchedules", // Alias for LectureSchedule association
    });
    this.hasMany(models.Lab, {
      foreignKey: "SubjectID",
      as: "Labs", // Alias for Lab association
    });
    this.hasMany(models.Assignment, {
      foreignKey: "SubjectID",
      as: "Assignments", // Alias for Assignment association
    }); // Add other associations as needed
  }
}

module.exports = Subject;
