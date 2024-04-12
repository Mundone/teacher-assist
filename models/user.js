const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(255),
        },
        email: {
          type: DataTypes.STRING(255),
        },
        code: {
          type: DataTypes.STRING(255),
        },
        is_secretary: {
          type: DataTypes.BOOLEAN(),
        },
        is_head_of_department: {
          type: DataTypes.BOOLEAN(),
        },
        role_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "user_role", // Make sure this matches your User model name
            key: "id",
          },
        },
        password: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: "user",
        tableName: "user",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.UserRole, { foreignKey: "role_id" });
    this.hasMany(models.UserFile, { foreignKey: "user_id" });
    this.hasMany(models.Subject, {
      foreignKey: "user_id",
    });

    this.belongsTo(models.School, { foreignKey: "school_id" });
    this.hasMany(models.Semester, {
      foreignKey: "user_id",
    });

    
    this.hasMany(models.Subject, {
      foreignKey: "head_of_department_user_id",
    });
    this.hasMany(models.Subject, {
      foreignKey: "secretary_user_id",
    });
  }
}

module.exports = User;
