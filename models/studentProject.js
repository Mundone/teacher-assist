const { Model, DataTypes } = require('sequelize');

class StudentProject extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'student', // Make sure this matches your Student model name
          key: 'id',
        },
      },
      project_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'project', // Make sure this matches your Subject model name
          key: 'id',
        },
      },
    }, {
      sequelize,
      modelName: 'student_project',
      tableName: 'student_project', 
      timestamps: true, // Cons_ider if you need timestamps
    });
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
    this.belongsTo(models.Project, { foreignKey: 'project_id' });
  }
}

module.exports = StudentProject;
