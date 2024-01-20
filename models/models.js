const moment = require("moment-timezone");
const nowTime = moment.utc().subtract(-8, "hours").toDate();

module.exports = (sequelize, DataTypes) => {
  const AttendanceRecord = sequelize.define(
    "AttendanceRecord",
    {
      AttendanceID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      StudentID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Students",
          key: "StudentID",
        },
      },
      SubjectID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Subjects",
          key: "SubjectID",
        },
      },
      LectureScheduleID: {
        type: DataTypes.INTEGER,
        references: {
          model: "LectureSchedules",
          key: "ScheduleID",
        },
      },
      AttendanceDate: {
        type: DataTypes.DATE,
      },
      Attended: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      timestamps: false,
    }
  );

  const LabSchedule = sequelize.define(
    "LabSchedule",
    {
      ScheduleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SubjectID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Subjects",
          key: "SubjectID",
        },
      },
      LabDay: {
        type: DataTypes.INTEGER,
      },
      LabTime: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );

  const LectureSchedule = sequelize.define(
    "LectureSchedule",
    {
      ScheduleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SubjectID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Subjects",
          key: "SubjectID",
        },
      },
      LectureDay: {
        type: DataTypes.INTEGER,
      },
      LectureTime: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );

  const Score = sequelize.define(
    "Score",
    {
      ScoreID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      StudentID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Students",
          key: "StudentID",
        },
      },
      SubjectID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Subjects",
          key: "SubjectID",
        },
      },
      LectureScores: {
        type: DataTypes.JSON,
      },
      LabScores: {
        type: DataTypes.JSON,
      },
      LabAttendanceScores: {
        type: DataTypes.JSON,
      },
      AssignmentScores: {
        type: DataTypes.JSON,
      },
      ExtraPoint: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );

  const Student = sequelize.define(
    "Student",
    {
      StudentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING(255),
      },
      StudentCode: {
        type: DataTypes.STRING(255),
      },
    },
    {
      timestamps: false,
    }
  );

  const StudentEnrollment = sequelize.define(
    "StudentEnrollment",
    {
      EnrollmentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      StudentID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Students",
          key: "StudentID",
        },
      },
      SubjectID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Subjects",
          key: "SubjectID",
        },
      },
      LectureScheduleID: {
        type: DataTypes.INTEGER,
        references: {
          model: "LectureSchedules",
          key: "ScheduleID",
        },
      },
      LabScheduleID: {
        type: DataTypes.INTEGER,
        references: {
          model: "LabSchedules",
          key: "ScheduleID",
        },
      },
    },
    {
      timestamps: false,
    }
  );

  const Subject = sequelize.define(
    "Subject",
    {
      SubjectID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SubjectName: {
        type: DataTypes.STRING(255),
      },
      TeacherID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Teachers",
          key: "TeacherID",
        },
      },
    },
    {
      timestamps: false,
    }
  );

  const Teacher = sequelize.define(
    "Teacher",
    {
      TeacherID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING(255),
      },
      RoleID: {
        type: DataTypes.INTEGER,
        references: {
          model: "TeacherRoles",
          key: "RoleID",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => nowTime,
      },
    },
    {
      timestamps: false,
    }
  );

  const TeacherFile = sequelize.define(
    "TeacherFile",
    {
      FileID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      TeacherID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Teachers",
          key: "TeacherID",
        },
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
    },
    {
      timestamps: false,
    }
  );

  const TeacherRole = sequelize.define(
    "TeacherRole",
    {
      RoleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      RoleName: {
        type: DataTypes.STRING(255),
      },
    },
    {
      timestamps: false,
    }
  );
  // Define common cascade options
  const cascadeOptions = {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  };

  // Associations
  //A
  AttendanceRecord.belongsTo(Subject, {
    foreignKey: "SubjectID",
    ...cascadeOptions,
  });
  AttendanceRecord.belongsTo(Student, { foreignKey: "StudentID", ...cascadeOptions });

  AttendanceRecord.belongsTo(LectureSchedule, {
    foreignKey: "LectureScheduleID",
    ...cascadeOptions,
  });

  //L
  LabSchedule.belongsTo(Subject, {
    foreignKey: "SubjectID",
    ...cascadeOptions,
  });
  LectureSchedule.hasMany(AttendanceRecord, {
    foreignKey: "LectureScheduleID",
    ...cascadeOptions,
  });
  LectureSchedule.belongsTo(Subject, {
    foreignKey: "SubjectID",
    ...cascadeOptions,
  });

  //S
  Score.belongsTo(Student, { foreignKey: "StudentID", ...cascadeOptions });
  Score.belongsTo(Subject, { foreignKey: "SubjectID", ...cascadeOptions });

  Student.hasMany(StudentEnrollment, {
    foreignKey: "StudentID",
    ...cascadeOptions,
  });
  Student.hasMany(Score, { foreignKey: "StudentID", ...cascadeOptions });
  Student.hasMany(AttendanceRecord, {
    foreignKey: "StudentID",
    ...cascadeOptions,
  });

  StudentEnrollment.belongsTo(Student, {
    foreignKey: "StudentID",
    ...cascadeOptions,
  });
  StudentEnrollment.belongsTo(Subject, {
    foreignKey: "SubjectID",
    ...cascadeOptions,
  });

  Subject.belongsTo(Teacher, { foreignKey: "TeacherID", ...cascadeOptions });
  Subject.hasMany(LectureSchedule, {
    foreignKey: "SubjectID",
    ...cascadeOptions,
  });
  Subject.hasMany(LabSchedule, { foreignKey: "SubjectID", ...cascadeOptions });
  Subject.hasMany(StudentEnrollment, {
    foreignKey: "SubjectID",

    ...cascadeOptions,
  });
  Subject.hasMany(Score, { foreignKey: "SubjectID", ...cascadeOptions });
  Subject.hasMany(AttendanceRecord, {
    foreignKey: "SubjectID",
    ...cascadeOptions,
  });

  //T
  Teacher.belongsTo(TeacherRole, { foreignKey: "RoleID", ...cascadeOptions });
  Teacher.hasMany(Subject, { foreignKey: "TeacherID", ...cascadeOptions });
  Teacher.hasMany(TeacherFile, { foreignKey: "TeacherID", ...cascadeOptions });

  TeacherFile.belongsTo(Teacher, {
    foreignKey: "TeacherID",
    ...cascadeOptions,
  });
  TeacherRole.hasMany(Teacher, { foreignKey: "RoleID", ...cascadeOptions });

  return {
    AttendanceRecord,
    LabSchedule,
    LectureSchedule,
    Teacher,
    TeacherFile,
    TeacherRole,
    Score,
    Student,
    StudentEnrollment,
    Subject,
    nowTime,
  };
};
