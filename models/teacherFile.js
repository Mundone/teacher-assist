const { Model, DataTypes } = require('sequelize');

class TeacherFile extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "teacher", // Make sure this matches your Teacher model name
          key: "id",
        },
      },
      file_name: {
        type: DataTypes.STRING(255),
      },
      file_path: {
        type: DataTypes.STRING(255),
      },
      file_type: {
        type: DataTypes.STRING(50),
      },
      upload_date: {
        type: DataTypes.DATE,
      },
    }, {
      sequelize,
      modelName: 'teacher_file',
      tableName: 'teacher_file', 
      timestamps: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.Teacher, { foreignKey: 'teacher_id' });
  }
}

module.exports = TeacherFile;
