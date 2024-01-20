const { Model, DataTypes } = require('sequelize');

class LabSchedule extends Model {
  static init(sequelize) {
    super.init({
      ScheduleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SubjectID: {
        type: DataTypes.INTEGER,
      },
      LabDay: {
        type: DataTypes.INTEGER,
      },
      LabTime: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'LabSchedule',
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.Subject, { foreignKey: 'SubjectID' });
  }
}

module.exports = LabSchedule;
