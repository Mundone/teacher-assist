const { Model, DataTypes } = require("sequelize");

class Schedule extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        schedule_name: {
          type: DataTypes.STRING,
        },
        schedule_day: {
          type: DataTypes.STRING,
        },
        schedule_time: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: "schedule",
        tableName: "schedule",
        timestamps: true,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.SubjectSchedule, {
      foreignKey: "schedule_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = Schedule;

// let weekTypes = [lessonType];

// if (scheduleParts[3]) {
//   weekTypes = WEEK_TYPE_MAP[scheduleParts[3].trim()] || weekTypes;
// }

// weekTypes = Array.isArray(weekTypes) ? weekTypes : [weekTypes];

// weekTypes.forEach((weekType) => {
//   schedules.push({
//     day: day,
//     time: time.toString(),
//     scheduleName: schedule.schedule_name,
//     lessonType: lessonType?.lesson_type_name,
//     classNumber: classNumber,
//     weekType: weekType,
//   });
// });

// async function readExcelAndExtractData(filepath) {
//   function columnToLetter(column) {
//     let temp;
//     let letter = "";
//     let col = column;
//     while (col > 0) {
//       temp = (col - 1) % 26;
//       letter = String.fromCharCode(temp + 65) + letter;
//       col = (col - temp - 1) / 26;
//     }
//     return letter;
//   }

//   function determineDayAndTime(columnNumber) {
//     const days = ["1", "2", "3", "4", "5"];
//     const totalColumns = COLUMNS_PER_DAY * DAY_COUNT;
//     const dayIndex = Math.floor(
//       ((columnNumber - MONDAY_START_COLUMN_NO) % totalColumns) / COLUMNS_PER_DAY
//     );
//     const timeSlot =
//       ((columnNumber - MONDAY_START_COLUMN_NO) % COLUMNS_PER_DAY) + 1; // Time slots start from 1

//     return {
//       day: days[dayIndex] || "Day out of range",
//       time: timeSlot,
//     };
//   }
//   function getLessonTypeByCode(code) {
//     const object = LESSON_TYPE_DATAS.find(
//       (obj) => obj.lesson_type_code_for_excel === code
//     );
//     return object ? object : null;
//   }
//   function getScheduleByDayAndTime(day, time) {
//     const object = SCHEDULE_DATAS.find(
//       (obj) => obj.schedule_day === day && obj.schedule_time === time
//     );
//     return object ? object : null;
//   }

//   const CELL_MAP = {
//     subjectCellIndex: "B",
//     userNameCellIndex: "C",
//     userEmailCellIndex: "D",
//     startDayColumnIndex: "G",
//   };
//   const WEEK_TYPE_MAP = {
//     тэгш: 6,
//     сонд: 7,
//     "т/с": [6, 7],
//   };
//   const MONDAY_START_COLUMN_NO = 7;
//   const COLUMNS_PER_DAY = 7;
//   const HEADER_ROW_COUNT = 3;
//   const DAY_COUNT = 5;
//   const USER_NAME_CELL_REGEX = /^(\w+\.\w+)\s*\/(.+?)\//;
//   const SUBJECT_CELL_REGEX = /^(\w+\.\w+)\s*-\s*(.+)/;
//   const MAX_EMPTY_ROW = 10;
//   const EVEN_ODD = "т/с";
//   const EVEN_LESSON_TYPE_TAIL_CODE = "сонд";
//   const ODD_LESSON_TYPE_TAIL_CODE = "тэгш";
//   const LESSON_TYPE_DATAS = await lessonTypeService.getAllLessonTypes({
//     isWithoutBody: true,
//   });
//   const SCHEDULE_DATAS = await scheduleService.getAllSchedulesService();

//   const SCHEDULE_REGEX_PATTERN = new RegExp(
//     `(${LESSON_TYPE_DATAS.map((type) => type.lesson_type_code_for_excel).join(
//       "|"
//     )})\\s+(\\d+-\\d+)(\\s+(${
//       ODD_LESSON_TYPE_TAIL_CODE +
//       "|" +
//       EVEN_LESSON_TYPE_TAIL_CODE +
//       "|" +
//       EVEN_ODD
//     }))?`,
//     "i"
//   );

//   const workbook = XLSX.readFile(filepath);
//   const sheetName = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheetName];
//   const data = [];

//   let lastValidSubject = null;
// for (
//   let row = HEADER_ROW_COUNT;
//   row <= sheet["!ref"].split(":")[1].match(/\d+/)[0];
//   row++
// ) {
//   const userNameCell = sheet[CELL_MAP.userNameCellIndex + row];
//   const userEmailCell = sheet[CELL_MAP.userEmailCellIndex + row];
//   const subjectCell = sheet[CELL_MAP.subjectCellIndex + row];

//   if (emptyRowCount >= MAX_EMPTY_ROW) break;

//   if (userNameCell && userNameCell.v) {
//     const userMatch = userNameCell.v.match(USER_NAME_CELL_REGEX);
//     let subjectMatch = subjectCell && subjectCell.v.match(SUBJECT_CELL_REGEX);

//     if (!subjectMatch && lastValidSubject) {
//       subjectMatch = lastValidSubject;
//     }

//     if (userMatch) {
//       const schedules = [];

//       for (
//         let colNum = MONDAY_START_COLUMN_NO;
//         colNum < MONDAY_START_COLUMN_NO + COLUMNS_PER_DAY * DAY_COUNT;
//         colNum++
//       ) {
//         let colLetter = columnToLetter(colNum);
//         const cellAddress = `${colLetter}${row}`;
//         const scheduleCell = sheet[cellAddress];

//         if (scheduleCell && scheduleCell.v.trim()) {
//           const scheduleText = scheduleCell.v.trim().toLowerCase();
//           const scheduleParts = scheduleText.match(SCHEDULE_REGEX_PATTERN);

//           if (scheduleParts) {
//             const { day, time } = determineDayAndTime(colNum);

//             const schedule = getScheduleByDayAndTime(day, time.toString());

//             const lessonTypeKey = scheduleParts[1].toLowerCase();
//             const lessonType = getLessonTypeByCode(lessonTypeKey);
//             const classNumber = scheduleParts[2];
//             let weekTypes = [lessonType];

//             if (scheduleParts[3]) {
//               weekTypes = WEEK_TYPE_MAP[scheduleParts[3].trim()] || weekTypes;
//             }

//             weekTypes = Array.isArray(weekTypes) ? weekTypes : [weekTypes];

//             weekTypes.forEach((weekType) => {
//               schedules.push({
//                 day: day,
//                 time: time.toString(),
//                 scheduleName: schedule.schedule_name,
//                 lessonType: lessonType?.lesson_type_name,
//                 classNumber: classNumber,
//                 weekType: weekType,
//               });
//             });
//           } else if (scheduleText) {
//             console.warn(
//               `Unexpected schedule format in cell ${cellAddress}: ${scheduleText}`
//             );
//           }
//         }
//       }

//       if (subjectMatch) {
//         lastValidSubject = subjectMatch;
//       }

//       data.push({
//         userCode: userMatch[1],
//         userName: userMatch[2].trim(),
//         userEmail: userEmailCell.v,
//         subjectCode: subjectMatch ? subjectMatch[1] : null,
//         subjectName: subjectMatch ? subjectMatch[2].trim() : null,
//         schedules: schedules,
//       });

//       emptyRowCount = 0;
//     } else {
//       emptyRowCount++;
//     }
//   } else {
//     emptyRowCount++;
//   }
// }

// return data;
// }
