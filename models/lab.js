const { Model, DataTypes } = require('sequelize');

class Lab extends Model {
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
          model: 'subject', // Make sure this matches your Subject model name
          key: 'id',
        },
      },
      lab_day: {
        type: DataTypes.INTEGER,
      },
      lab_time: {
        type: DataTypes.INTEGER,
      },
      max_score: {
        type: DataTypes.INTEGER,
      },
      lab_number: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'lab',
      tableName: 'lab', 
      timestamps: false, // Consider if you need timestamps
    });
  }

  static associate(models) {
    this.belongsTo(models.Subject, { foreignKey: 'subject_id' });
  }
}

module.exports = Lab;
