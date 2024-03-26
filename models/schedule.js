const { Model, DataTypes } = require('sequelize');

class Schedule extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      schedule_name: {
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      modelName: 'schedule',
      tableName: 'schedule', 
      timestamps: true,
    });
  }

  static associate(models) {
    this.hasMany(models.SubjectSchedule, { foreignKey: 'schedule_id' });
}
}

module.exports = Schedule;
