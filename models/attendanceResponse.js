const { Model, DataTypes } = require('sequelize');

class AttendanceResponse extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      attendance_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'attendance',
          key: 'id',
        },
      },
      submitted_name: {
        type: DataTypes.STRING(255),
      },
      submitted_code: {
        type: DataTypes.STRING(255),
      },
    }, {
      sequelize,
      modelName: 'attendance_response',
      tableName: 'attendance_response', 
      timestamps: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.Attendance, { foreignKey: 'attendance_id' });
  }
}

module.exports = AttendanceResponse;
