const { Model, DataTypes } = require('sequelize');

class LessonAssessment extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lesson_assessment_code: {
        type: DataTypes.STRING(255),
      },
      lesson_assessment_description: {
        type: DataTypes.STRING(255),
      },
      score: {
        type: DataTypes.FLOAT,
      }
    }, {
      sequelize,
      modelName: 'lesson_assessment',
      tableName: 'lesson_assessment',
      timestamps: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.LessonType, { foreignKey: "lesson_type_id" });
  }
}

module.exports = LessonAssessment;
