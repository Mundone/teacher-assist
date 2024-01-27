const { Model, DataTypes } = require('sequelize');

class Score extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'student', // Ensure this matches your Subject model name
          key: 'id',
        },
      },
      subject_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'subject', // Make sure this matches your Subject model name
          key: 'id',
        },
      },
      lecture_scores: {
        type: DataTypes.JSON,
      },
      lab_scores: {
        type: DataTypes.JSON,
      },
      lab_attendance_scores: {
        type: DataTypes.JSON,
      },
      assignment_scores: {
        type: DataTypes.JSON,
      },
      extra_point: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'score',
      tableName: 'score', 
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
    this.belongsTo(models.Subject, { foreignKey: 'subject_id' });
  }
}

module.exports = Score;
