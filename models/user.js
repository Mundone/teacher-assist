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
            model: "user_role",
            key: "id",
          },
        },
        password: {
          type: DataTypes.STRING,
        },
        profile_image: {
          type: DataTypes.STRING(10000),
        },
        teams_auth_token: {
          type: DataTypes.STRING(255),
        },
        player_id: {
          type: DataTypes.STRING(255),
        },
        job_title: {
          type: DataTypes.STRING(255),
        },
        phone_number: {
          type: DataTypes.STRING(255),
        },
        office_location: {
          type: DataTypes.STRING(255),
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
    this.belongsTo(models.UserRole, {
      foreignKey: "role_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    this.hasMany(models.Subject, {
      foreignKey: "teacher_user_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.belongsTo(models.School, {
      foreignKey: "school_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    this.hasMany(models.Semester, {
      foreignKey: "admin_user_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
      this.hasMany(models.Survey, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    
  }
}

module.exports = User;
