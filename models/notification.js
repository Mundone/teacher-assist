const { Model, DataTypes } = require("sequelize");

class Notification extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING(255),
        },
        notification_text: {
          type: DataTypes.STRING(255),
        },
        image_link: {
          type: DataTypes.STRING(255),
        },
        notification_date: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        modelName: "notification",
        tableName: "notification",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    
    this.belongsTo(models.Subject, {
      foreignKey: "subject_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = Notification;
