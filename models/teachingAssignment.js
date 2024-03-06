const { Model, DataTypes } = require("sequelize");

class TeachingAssignment extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
      subject_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "subject",
          key: "id",
        },
      },
      lesson_type_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "lesson_type",
          key: "id",
        },
      },
    }, {
      sequelize,
      modelName: 'teaching_assignment',
      uniqueKeys: {
        items_unique: {
          fields: ['user_id', 'subject_id', 'lesson_type_id']
        }
      }
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.Subject, { foreignKey: 'subject_id' });
    this.belongsTo(models.LessonType, { foreignKey: 'lesson_type_id' });
  }

}

module.exports = TeachingAssignment;
