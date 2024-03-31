const { Model, DataTypes } = require("sequelize");

class SubSchool extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        sub_school_name: {
          type: DataTypes.STRING(255),
        },
        sub_school_latitude1: {
          type: DataTypes.STRING(255),
        },
        sub_school_longitude1: {
          type: DataTypes.STRING(255),
        },
        sub_school_latitude2: {
          type: DataTypes.STRING(255),
        },
        sub_school_longitude2: {
          type: DataTypes.STRING(255),
        },
        sub_school_latitude3: {
          type: DataTypes.STRING(255),
        },
        sub_school_longitude3: {
          type: DataTypes.STRING(255),
        },
        sub_school_latitude4: {
          type: DataTypes.STRING(255),
        },
        sub_school_longitude4: {
          type: DataTypes.STRING(255),
        },
        is_active: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        sequelize,
        modelName: "sub_school",
        tableName: "sub_school",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.User, {
      foreignKey: "sub_school_id",
    });
    this.belongsTo(models.School, { foreignKey: "school_id" });
  }
}

module.exports = SubSchool;
