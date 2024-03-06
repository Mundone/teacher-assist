const { Model, DataTypes } = require("sequelize");
const moment = require("moment-timezone");

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
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        sequelize,
        modelName: "user",
        tableName: "user",
        timestamps: true,
        hooks: {
          beforeCreate: (user, options) => {
            user.created_at = moment.utc().subtract(-8, "hours").toDate();
          },
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.UserRole, { foreignKey: "role_id" });
    this.hasMany(models.UserFile, { foreignKey: "user_id" });
    this.hasMany(models.TeachingAssignment, { foreignKey: 'user_id' });
    this.belongsToMany(models.Subject, {
      through: models.TeachingAssignment,
      foreignKey: 'user_id',
      otherKey: 'subject_id'
    });
  }
}

module.exports = User;
