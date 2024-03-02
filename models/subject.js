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
    this.belongsToMany(models.Teacher, {
      through: "teacher_subject",
      foreignKey: "subject_id",
      otherKey: "teacher_id",
    });

    this.hasMany(models.Lesson, {
      foreignKey: "subject_id",
    });
    this.hasMany(models.SubjectSchedule, {
      foreignKey: "subject_id",
    });
  }
}

module.exports = Subject;
