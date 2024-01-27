const { Model, DataTypes } = require('sequelize');

class Assignment extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'subject', // Ensure this matches your Subject model name
          key: 'id',
        },
      },
      max_score: {
        type: DataTypes.INTEGER,
      },
      assignment_number: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'assignment',
      tableName: 'assignment', 
      timestamps: false, // Consider if you need timestamps
    });
  }

  static associate(models) {
    this.belongsTo(models.Subject, { foreignKey: 'subject_id' });
  }
}

module.exports = Assignment;
