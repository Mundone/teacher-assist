const { Model, DataTypes } = require("sequelize");

class TeacherSubject extends Model {
    static init(sequelize) {
      super.init({
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        teacher_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'teacher',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        subject_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'subject',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        // createdAt: {
        //   allowNull: false,
        //   type: DataTypes.DATE,
        // //   defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
        // },
        // updatedAt: {
        //   allowNull: false,
        //   type: DataTypes.DATE,
        // //   defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        // }
      }, {
        sequelize,
        modelName: 'teacher_subject',
        tableName: 'teacher_subject', // Sequelize defaults to pluralized model names for table names
        timestamps: true, // Set to false if you don't need createdAt and updatedAt columns
      });
    }
  }


// module.exports = {
//     up: async (queryInterface, Sequelize) => {
//       await queryInterface.createTable('TeacherSubject', {
//       });
//     },
//     down: async (queryInterface, Sequelize) => {
//       await queryInterface.dropTable('TeacherSubject');
//     }
//   };
  
module.exports = TeacherSubject;
