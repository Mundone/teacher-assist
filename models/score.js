const { Model, DataTypes } = require('sequelize');

class Score extends Model {
  static init(sequelize) {
    super.init({
      ScoreID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      StudentID: {
        type: DataTypes.INTEGER,
      },
      SubjectID: {
        type: DataTypes.INTEGER,
      },
      LectureScores: {
        type: DataTypes.JSON,
      },
      LabScores: {
        type: DataTypes.JSON,
      },
      LabAttendanceScores: {
        type: DataTypes.JSON,
      },
      AssignmentScores: {
        type: DataTypes.JSON,
      },
      ExtraPoint: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'Score',
      tableName: 'Scores', 
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'StudentID' });
    this.belongsTo(models.Subject, { foreignKey: 'SubjectID' });
  }
}

module.exports = Score;
