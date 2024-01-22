const { Model, DataTypes } = require('sequelize');

class Assignment extends Model {
  static init(sequelize) {
    super.init({
      AssignmentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SubjectID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Subjects', // Ensure this matches your Subject model name
          key: 'SubjectID',
        },
      },
      MaxScore: {
        type: DataTypes.INTEGER,
      },
      AssignmentNumber: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'Assignment',
      tableName: 'Assignments', 
      timestamps: false, // Consider if you need timestamps
    });
  }

  static associate(models) {
    this.belongsTo(models.Subject, { foreignKey: 'SubjectID' });
  }
}

module.exports = Assignment;
