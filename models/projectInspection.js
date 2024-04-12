const { Model, DataTypes } = require('sequelize');

class ProjectInspection extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      project_inspection_name: {
        type: DataTypes.STRING(255),
      },
      project_inspection_date: {
        type: DataTypes.STRING(255),
      },
      score: {
        type: DataTypes.FLOAT,
      },
    }, {
      sequelize,
      modelName: 'project_inspection',
      tableName: 'project_inspection',
      timestamps: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.Project, { foreignKey: "project_id" });
  }
}

module.exports = ProjectInspection;
