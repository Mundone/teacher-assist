const { Model, DataTypes } = require('sequelize');

class UserFile extends Model {
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
          model: "user", // Make sure this matches your User model name
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
      modelName: 'user_file',
      tableName: 'user_file', 
      timestamps: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

module.exports = UserFile;
