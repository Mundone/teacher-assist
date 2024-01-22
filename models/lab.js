const { Model, DataTypes } = require('sequelize');

class Lab extends Model {
  static init(sequelize) {
    super.init({
      LabID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SubjectID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Subjects', // Make sure this matches your Subject model name
          key: 'SubjectID',
        },
      },
      LabDay: {
        type: DataTypes.INTEGER,
      },
      LabTime: {
        type: DataTypes.INTEGER,
      },
      MaxScore: {
        type: DataTypes.INTEGER,
      },
      LabNumber: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'Lab',
      tableName: 'Labs', 
      timestamps: false, // Consider if you need timestamps
    });
  }

  static associate(models) {
    this.belongsTo(models.Subject, { foreignKey: 'SubjectID' });
  }
}

module.exports = Lab;
