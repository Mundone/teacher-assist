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
      default_grade: {
        type: DataTypes.FLOAT,
      },
      lesson_type_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "lesson_type",
          key: "id",
        },
      },
      lesson_assessment_sort: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      modelName: 'lesson_assessment',
      tableName: 'lesson_assessment',
      timestamps: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.LessonType, { foreignKey: "lesson_type_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE", });
    this.hasMany(models.Lesson, {
      foreignKey: "lesson_assessment_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = LessonAssessment;
