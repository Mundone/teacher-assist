const { Model, DataTypes } = require('sequelize');

class Teacher extends Model {
  static init(sequelize) {
    super.init({
      TeacherID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING(255),
      },
      RoleID: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      sequelize,
      modelName: 'Teacher',
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.TeacherRole, { foreignKey: 'RoleID' });
    this.hasMany(models.Subject, { foreignKey: 'TeacherID' });
    this.hasMany(models.TeacherFile, { foreignKey: 'TeacherID' });
  }
}

module.exports = Teacher;
