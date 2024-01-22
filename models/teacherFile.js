const { Model, DataTypes } = require('sequelize');

class TeacherFile extends Model {
  static init(sequelize) {
    super.init({
      FileID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      TeacherID: {
        type: DataTypes.INTEGER,
      },
      FileName: {
        type: DataTypes.STRING(255),
      },
      FilePath: {
        type: DataTypes.STRING(255),
      },
      FileType: {
        type: DataTypes.STRING(50),
      },
      UploadDate: {
        type: DataTypes.DATE,
      },
    }, {
      sequelize,
      modelName: 'TeacherFile',
      tableName: 'TeacherFiles', 
      timestamps: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.Teacher, { foreignKey: 'TeacherID' });
  }
}

module.exports = TeacherFile;
