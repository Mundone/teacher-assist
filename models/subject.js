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
        teacher_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "teacher", // Make sure this matches your Teacher model name
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
    this.belongsTo(models.Teacher, { foreignKey: "teacher_id" });
    this.hasMany(models.LectureSchedule, {
      foreignKey: "subject_id",
    });
    this.hasMany(models.Lab, {
      foreignKey: "subject_id",
    });
    this.hasMany(models.Assignment, {
      foreignKey: "subject_id",
    }); // Add other associations as needed
  }
}

module.exports = Subject;
