const { Model, DataTypes } = require("sequelize");

class Project extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        project_name: {
          type: DataTypes.STRING(255),
        },
        project_code: {
          type: DataTypes.STRING(255),
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
        modelName: "project",
        tableName: "project",
        timestamps: true, // Consider if you need timestamps
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "head_of_department_user_id" });
    this.belongsTo(models.User, { foreignKey: "secretary_user_id" });
    this.hasMany(models.StudentProject, {
      foreignKey: "project_id",
    });

    
  }
}

module.exports = Project;
