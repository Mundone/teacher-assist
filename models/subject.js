const { Model, DataTypes } = require('sequelize');

class Subject extends Model {
  static init(sequelize) {
    super.init({
      SubjectID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SubjectName: {
        type: DataTypes.STRING(255),
      },
      TeacherID: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'Subject',
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.Teacher, { foreignKey: 'TeacherID' });
    this.hasMany(models.LectureSchedule, { foreignKey: 'SubjectID' });
    this.hasMany(models.LabSchedule, { foreignKey: 'SubjectID' });
    // Add other associations here
  }
}

module.exports = Subject;
