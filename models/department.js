const { Model, DataTypes } = require("sequelize");

class Department extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        department_name: {
          type: DataTypes.STRING(255),
        },
        is_active: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        sequelize,
        modelName: "department",
        tableName: "department",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    // this.hasMany(models.User, {
    //   foreignKey: "department_id",
    // });
  }
}

module.exports = Department;
