const { Model, DataTypes } = require("sequelize");
const moment = require("moment-timezone");

class Teacher extends Model {
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
            model: "teacher_role", // Make sure this matches your Teacher model name
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
        modelName: "teacher",
        tableName: "teacher",
        timestamps: true,
        hooks: {
          beforeCreate: (teacher, options) => {
            teacher.created_at = moment.utc().subtract(-8, "hours").toDate();
          },
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.TeacherRole, { foreignKey: "role_id" });
    this.hasMany(models.TeacherFile, { foreignKey: "teacher_id" });
    this.hasMany(models.TeachingAssignment, { foreignKey: 'teacher_id' });
    this.belongsToMany(models.Subject, {
      through: models.TeachingAssignment,
      foreignKey: 'teacher_id',
      otherKey: 'subject_id'
    });
  }
}

module.exports = Teacher;
