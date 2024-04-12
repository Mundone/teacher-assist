const { Model, DataTypes } = require("sequelize");

class ProjectGrade extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        student_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "student", // Ensure this matches your Subject model name
            key: "id",
          },
        },
        project_inspection_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "project_inspection", // Make sure this matches your Subject model name
            key: "id",
          },
        },
        week_number: {
          type: DataTypes.INTEGER,
        },
        grade: {
          type: DataTypes.FLOAT,
        },
      },
      {
        sequelize,
        modelName: "project_grade",
        tableName: "project_grade",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: "student_id" });
    this.belongsTo(models.ProjectInspection, { foreignKey: "project_inspection_id" });
  }
}

module.exports = ProjectGrade;
