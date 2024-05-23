const allModels = require("../models");

const getAllStudentGradesService = async ({
  where,
  limit,
  offset,
  order,
  userId,
  subjectId,
  isForStudent,
  studentCode,
  lessonTypeId,
}) => {
  const isUserIncludeSubject = await allModels.Subject.findOne({
    where: { id: subjectId, teacher_user_id: userId },
  });

  if (!isUserIncludeSubject) {
    const error = new Error("Зөвшөөрөлгүй хандалт.");
    error.statusCode = 403;
    throw error;
  }

  const whereClause = {
    subject_id: subjectId,
  };

  if (lessonTypeId != null) {
    if (lessonTypeId !== 0) {
      whereClause.lesson_type_id = lessonTypeId;
    }
  }

  let { count: totalGrades, rows: grades } =
    await allModels.Student.findAndCountAll({
      include: [
        {
          model: allModels.Grade,
          attributes: ["id", "grade"],

          include: {
            model: allModels.Lesson,
            attributes: [
              "lesson_assessment_id",
              "week_number",
              "createdAt",
              "lesson_number",
              "convert_grade",
            ],
            where: whereClause,
            include: [
              {
                model: allModels.LessonAssessment,
                attributes: [
                  "lesson_type_id",
                  "lesson_assessment_code",
                  "lesson_assessment_sort",
                ],
                // include: {
                //   model: allModels.LessonType,
                //   attributes: ["id", "lesson_type_name", "lesson_type_sort"],
                // },
              },
              {
                model: allModels.LessonType,
                attributes: ["id", "lesson_type_name", "lesson_type_sort"],
              },
            ],
          },

          order: [["id", "asc"]],
        },
      ],
      attributes: ["name", "student_code"],

      // where: { subject_id: subjectId },

      where: where,
      limit: limit,
      offset: offset,
      order: [["student_code", "asc"]],
      distinct: true,
    });

  return {
    totalGrades,
    grades,
  };
};

const getAllStudentGradesChatGPTService = async (userId) => {
  let rawData = await allModels.Subject.findAll({
    where: {
      teacher_user_id: userId,
    },
    attributes: ["subject_name", "subject_code"],
    include: [
      {
        model: allModels.SubjectSchedule,
        attributes: ["id"],
        include: [
          {
            model: allModels.LessonType,
            attributes: ["lesson_type_name"],
          },
          {
            model: allModels.Schedule,
            attributes: ["schedule_name", "schedule_day", "schedule_time"],
          },
          {
            model: allModels.StudentSubjectSchedule,
            attributes: ["id"],
            include: [
              {
                model: allModels.Student,
                attributes: ["name", "student_code"],
                include: [
                  {
                    model: allModels.Grade,
                    attributes: ["grade"],
                    include: [
                      {
                        model: allModels.Lesson,
                        attributes: ["week_number"],
                        include: [
                          {
                            model: allModels.LessonAssessment,
                            attributes: ["lesson_assessment_code"],
                            include: [
                              {
                                model: allModels.LessonType,
                                attributes: ["lesson_type_name"],
                                required: true
                              }
                            ]
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  // Process rawData to create the desired structure with dynamic lesson type matching
  const gradesData = rawData.map(subject => ({
    subject_name: subject.subject_name,
    subject_code: subject.subject_code,
    students: subject.subject_schedules.reduce((acc, scheduleObject) => {
      scheduleObject.student_subject_schedules.forEach(studentSchedule => {
        let student = acc.find(s => s.student_code === studentSchedule.student.student_code);
        if (!student) {
          student = {
            name: studentSchedule.student.name,
            student_code: studentSchedule.student.student_code,
            student_subject_schedules: []
          };
          acc.push(student);
        }
        const studentScheduleData = {
          id: scheduleObject.id,
          lesson_type: scheduleObject.lesson_type.lesson_type_name,
          schedule: {
            schedule_name: scheduleObject.schedule.schedule_name,
            schedule_day: scheduleObject.schedule.schedule_day,
            schedule_time: scheduleObject.schedule.schedule_time,
          },
          grades: []
        };
        const assessments = {};
        studentSchedule.student.grades.forEach(gradeObject => {
          const lessonAssessment = gradeObject.lesson.lesson_assessment;
          // Match lesson type names dynamically
          if (studentScheduleData.lesson_type === lessonAssessment.lesson_type.lesson_type_name) {
            const code = lessonAssessment.lesson_assessment_code;
            if (!assessments[code]) {
              assessments[code] = {
                lesson_assessment_code: code,
                grades: []
              };
            }
            assessments[code].grades.push({
              grade: gradeObject.grade,
              week_number: gradeObject.lesson.week_number
            });
          }
        });
        studentScheduleData.grades = Object.values(assessments);
        student.student_subject_schedules.push(studentScheduleData);
      });
      return acc;
    }, [])
  }));

  return gradesData;
};


function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return; // Skip circular references
      }
      seen.add(value);
    }
    return value;
  };
}

function createLookup(items, key) {
  const lookup = {};
  const result = [];

  items.forEach((item) => {
    const keyValue = item[key];
    if (!lookup[keyValue]) {
      lookup[keyValue] = { ...item, id: Object.keys(lookup).length + 1 };
      result.push(lookup[keyValue]);
    }
  });

  return { lookup, result };
}

function transformLessons(lessons) {
  const { lookup: lessonAssessmentLookup, result: lessonAssessments } =
    createLookup(
      lessons.map((l) => l.lesson_assessment),
      "lesson_assessment_code"
    );
  const { lookup: lessonTypeLookup, result: lessonTypes } = createLookup(
    lessons.map((l) => l.lesson_type),
    "lesson_type_name"
  );

  const transformedLessons = lessons.map((l) => ({
    week_number: l.week_number,
    grade: l.grade,
    lesson_assessment_id:
      lessonAssessmentLookup[l.lesson_assessment.lesson_assessment_code].id,
    lesson_type_id: lessonTypeLookup[l.lesson_type.lesson_type_name].id,
  }));

  return {
    lessons: transformedLessons,
    assessments: lessonAssessments,
    types: lessonTypes,
  };
}

// await allModels.Lesson.findAndCountAll({
//   include: [
//     {
//       model: allModels.Grade,
//       attributes: ["id", "grade"],

//       include: {
//         model: allModels.Student,
//         attributes: ["name", "student_code"],
//       },
//     },
//     {
//       model: allModels.LessonAssessment,
//       attributes: ["lesson_type_id", "lesson_assessment_code"],
//       include: {
//         model: allModels.LessonType,
//         attributes: ["id", "lesson_type_name"],
//       },
//     },
//   ],
//   attributes: ["lesson_assessment_id", "week_number", "createdAt"],

//   where: { subject_id: subjectId },

//   where: where,
//   limit: limit,
//   offset: offset,
//   order: order,
//   distinct: true,
// });

// return {
// totalGrades,
// grades,
// };
// };

// await allModels.Student.findAndCountAll({
//   include: [
//     {
//       model: allModels.Grade,
//       attributes: [
//         // "id",
//         // "student_id",
//         //  "lesson_id",
//         "grade",
//       ],

//       include: {
//         model: allModels.Lesson,
//         attributes: [
//           // "id",
//           // "subject_id",
//           "lesson_assessment_id",
//           "week_number",
//           // "lesson_number",
//           "createdAt",
//           // "lesson_type_id",
//         ],
//         include: {
//           model: allModels.LessonAssessment,
//           attributes: ["lesson_type_id"],
//           include: {
//             model: allModels.LessonType,
//             attributes: ["id", "lesson_type_name"],
//           },
//         },
//         where: { subject_id: subjectId },

//       },
//     },
//   ],
//   attributes: ["id", "name", "student_code", "createdAt"],

//   where: where,
//   limit: limit,
//   offset: offset,
//   order: order,
//   distinct: true,
// });

// await allModels.Grade.findAndCountAll({
//   include: [
//     {
//       model: allModels.Student,
//       attributes: ["id", "name", "student_code", "createdAt"],
//     },
//     {
//       model: allModels.Lesson,
//       attributes: [
//         "id",
//         "subject_id",
//         "lesson_assessment_id",
//         "week_number",
//         "lesson_number",
//         "createdAt",
//         "lesson_type_id",
//       ],
//       where: { subject_id: subjectId },
//     },
//   ],
//   attributes: ["id", "student_id", "lesson_id", "grade"],

//   where: where,
//   limit: limit,
//   offset: offset,
//   order: order,
//   distinct: true,
// });

const updateGradeService = async (id, data, userId, isFromAttendance) => {
  const gradeObject = await allModels.Grade.findByPk(id, {
    include: [
      {
        model: allModels.Lesson,
        attributes: ["subject_id"],
        include: {
          model: allModels.Subject,
          attributes: ["id"],
        },
      },
    ],
    attributes: ["lesson_id"],
  });
  const subjectId = gradeObject.lesson.subject.id;

  if (!isFromAttendance) {
    const isUserIncludeGrade = await allModels.Subject.findOne({
      where: { id: subjectId, teacher_user_id: userId },
    });

    if (!isUserIncludeGrade) {
      const error = new Error("Зөвшөөрөлгүй хандалт.");
      error.statusCode = 403;
      throw error;
    }
  }

  const currentModel = await allModels.Grade.findByPk(id);
  if (currentModel) {
    return await currentModel.update(data);
  }
  return null;
};

module.exports = {
  getAllStudentGradesService,
  updateGradeService,
  getAllStudentGradesChatGPTService,
};
