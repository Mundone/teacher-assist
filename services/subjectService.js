const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getAllSubjects = async ({
  where,
  limit,
  offset,
  order,
  isWithoutBody,
}) => {
  if (isWithoutBody) {
    return await allModels.Subject.findAll({
      attributes: [
        "id",
        "subject_name",
        "subject_code",
        "is_started",
        "createdAt",
        [
          Sequelize.literal(`(
          SELECT COUNT(DISTINCT student.id)
          FROM student_subject_schedule
          JOIN student ON student.id = student_subject_schedule.student_id
          JOIN subject_schedule ON subject_schedule.id = student_subject_schedule.subject_schedule_id
          WHERE subject_schedule.subject_id = subject.id
        )`),
          "student_count",
        ],
      ],
      where: where,
      include: [
        {
          model: allModels.SubjectLessonType,
          attributes: ["lesson_type_id"],
          include: [
            {
              model: allModels.LessonType,
              attributes: ["lesson_type_name"],
            },
          ],
        },
        {
          model: allModels.SubjectSchedule,
          attributes: ["lesson_type_id"],
          include: [
            {
              model: allModels.StudentSubjectSchedule,
              attributes: [
                "id",
                "student_id",
                "subject_schedule_id",
                "createdAt",
              ],
              include: [
                {
                  model: allModels.Student,
                },
              ],
            },
            {
              model: allModels.LessonType,
              attributes: ["id", "lesson_type_name"],
            },
            {
              model: allModels.Schedule,
            },
          ],
          attributes: [
            "id",
            "subject_id",
            "lesson_type_id",
            // "lecture_day",
            // "lecture_time",
            "createdAt",
          ],
        },
      ],
    });
  }

  let { count: totalSubjects, rows: subjects } =
    await allModels.Subject.findAndCountAll({
      attributes: [
        "id",
        "subject_name",
        "subject_code",
        "is_started",
        "createdAt",
        [
          Sequelize.literal(`(
        SELECT COUNT(DISTINCT student.id)
        FROM student_subject_schedule
        JOIN student ON student.id = student_subject_schedule.student_id
        JOIN subject_schedule ON subject_schedule.id = student_subject_schedule.subject_schedule_id
        WHERE subject_schedule.subject_id = subject.id
      )`),
          "student_count",
        ],
      ],
      include: [
        {
          model: allModels.SubjectLessonType,
          attributes: ["lesson_type_id"],
          include: [
            {
              model: allModels.LessonType,
              attributes: ["lesson_type_name"],
            },
          ],
        },
        {
          model: allModels.SubjectSchedule,
          attributes: ["lesson_type_id"],
          include: [
            {
              model: allModels.Subject,
              attributes: ["id", "subject_name", "is_started"],
            },
            {
              model: allModels.LessonType,
              attributes: ["id", "lesson_type_name"],
            },
          ],
          attributes: [
            "id",
            "subject_id",
            "lesson_type_id",
            // "lecture_day",
            // "lecture_time",
            "createdAt",
          ],
        },
      ],
      where: where,
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

  return {
    totalSubjects,
    subjects,
  };
};

const getAllStudentsSubjectsService = async ({ studentId }) => {
  return await allModels.Subject.findAll({
    attributes: [
      "id",
      "subject_name",
      "subject_code",
      "is_started",
      "createdAt",
    ],
    include: [
      {
        model: allModels.SubjectSchedule,
        attributes: ["lesson_type_id"],
        include: [
          {
            model: allModels.StudentSubjectSchedule,
            attributes: [], // No need for specific attributes in this model
            where: { student_id: studentId },
          },
          {
            model: allModels.LessonType,
            attributes: ["id", "lesson_type_name"],
          },
          {
            model: allModels.Schedule,
          },
        ],
        attributes: ["id", "subject_id", "lesson_type_id", "createdAt"],
      },
    ],
    order: [["createdAt", "DESC"]],
    distinct: true,
    where: {
      "$subject_schedules.student_subject_schedules.student_id$": studentId,
    },
  });
};

// const getAllSubjects = async ({
//   where,
//   limit,
//   offset,
//   order,
//   isWithoutBody,
// }) => {
//   if (isWithoutBody) {
//     return await allModels.Subject.findAll({
//       attributes: [
//         "id",
//         "subject_name",
//         "createdAt",
//         [Sequelize.fn("COUNT", Sequelize.col("subject_schedules.student_subject_schedules.student_id")), "studentCount"]
//       ],
//       include: [{
//         model: allModels.SubjectSchedule,
//         attributes: [],
//         include: [{
//           model: allModels.StudentSubjectSchedule,
//           attributes: []
//         }]
//       }],
//       group: ["subject.id", "subject_schedules.id"],
//       raw: true,
//     });

//   }

//   let { count: totalSubjects, rows: subjects } =
//     await allModels.Subject.findAndCountAll({
//       attributes: [
//         "id",
//         "subject_name",
//         "createdAt",
//         [Sequelize.fn("COUNT", Sequelize.col("subject_schedules.student_subject_schedules.student_id")), "studentCount"]
//       ],
//       include: [{
//         model: allModels.SubjectSchedule,
//         attributes: [],
//         include: [{
//           model: allModels.StudentSubjectSchedule,
//           attributes: [
//           ],
//         }]
//       }],
//       group: ["subject.id", "subject_schedules.id"],
//       raw: true,
//       where: where,
//       // limit: limit,
//       offset: offset,
//       order: order,
//       distinct: true,
//     });

//   return {
//     totalSubjects,
//     subjects,
//   };
// };
const getSubjectById = async (id, userId) => {
  await checkIfUserCorrect(id, userId);

  const subject = await allModels.Subject.findByPk(id, {
    attributes: [
      "id",
      "subject_name",
      "is_started",
      "subject_code",
      "createdAt",
    ],
    include: [
      {
        model: allModels.SubjectSchedule,
        attributes: ["lesson_type_id", "schedule_id"],
        include: [
          {
            model: allModels.Schedule,
            attributes: ["id", "schedule_name"],
          },
        ],
      },
    ],
  });

  let result = {
    subject_name: subject.subject_name,
    subject_code: subject.subject_code,
    subject_schedules: [],
  };

  if (subject && subject.subject_schedules) {
    const grouped = subject.subject_schedules.reduce((acc, schedule) => {
      let group = acc.find((g) => g.lesson_type_id === schedule.lesson_type_id);
      if (!group) {
        group = {
          lesson_type_id: schedule.lesson_type_id,
          schedule_ids: [],
        };
        acc.push(group);
      }
      group.schedule_ids.push({
        schedule_id: schedule?.schedule_id,
        schedule_name: schedule?.schedule?.schedule_name,
      });
      return acc;
    }, []);

    result.subject_schedules = grouped;
  }

  return result;
};

const createSubject = async (data, user_id, transaction) => {
  const options = {};
  if (transaction) {
    options.transaction = transaction;
  }

  const subjectObject = await allModels.Subject.create(
    {
      subject_name: data.subject_name,
      subject_code: data.subject_code,
      teacher_user_id: user_id,
      is_started: false,
    },
    options
  );

  let subjectSchedulesToCreate = [];
  let lessonsToCreate = [];

  let excludeLessonTypeIds = [];
  for (const subject_schedule of data.subject_schedules) {
    let lessonAssessmentObjects = null;
    if (subject_schedule?.lesson_type_id) {
      await allModels.SubjectLessonType.create(
        {
          subject_id: subjectObject?.id,
          lesson_type_id: subject_schedule?.lesson_type_id,
        },
        options
      );
      for (const schedule_id of subject_schedule?.schedule_ids) {
        subjectSchedulesToCreate.push({
          subject_id: subjectObject?.id,
          lesson_type_id: subject_schedule?.lesson_type_id,
          schedule_id,
        });
      }

      const checkLessonTypeObject = await allModels.LessonType.findByPk(
        subject_schedule?.lesson_type_id
      );
      if (
        checkLessonTypeObject?.parent_lesson_type_id == null ||
        checkLessonTypeObject?.parent_lesson_type_id == 0
      ) {
        lessonAssessmentObjects = await allModels.LessonAssessment.findAll(
          {
            where: { lesson_type_id: subject_schedule?.lesson_type_id },
          },
          options
        );
      } else {
        lessonAssessmentObjects = await allModels.LessonAssessment.findAll(
          {
            where: {
              lesson_type_id: checkLessonTypeObject?.parent_lesson_type_id,
            },
          },
          options
        );
      }
    } else {
      if (subject_schedule) {
        const checkLessonTypeObject = await allModels.LessonType.findByPk(
          subject_schedule
        );

        if (
          checkLessonTypeObject?.parent_lesson_type_id == null ||
          checkLessonTypeObject?.parent_lesson_type_id == 0
        ) {
          lessonAssessmentObjects = await allModels.LessonAssessment.findAll(
            {
              where: { lesson_type_id: subject_schedule },
              include: [
                {
                  model: allModels.LessonType,
                },
              ],
            },
            options
          );
        } else {
          if (
            excludeLessonTypeIds.includes(
              checkLessonTypeObject?.parent_lesson_type_id
            )
          ) {
            lessonAssessmentObjects = null;
          } else {
            lessonAssessmentObjects = await allModels.LessonAssessment.findAll(
              {
                where: {
                  lesson_type_id: checkLessonTypeObject?.parent_lesson_type_id,
                },
                include: [
                  {
                    model: allModels.LessonType,
                  },
                ],
              },
              options
            );

            if (
              excludeLessonTypeIds.includes(
                checkLessonTypeObject?.parent_lesson_type_id
              )
            ) {
            } else {
              excludeLessonTypeIds.push(
                checkLessonTypeObject?.parent_lesson_type_id
              );
            }
          }
        }
      }
    }
    if (lessonAssessmentObjects) {
      for (const lessonAssessmentObject of lessonAssessmentObjects) {
        for (
          let i = 0;
          i < lessonAssessmentObject?.lesson_type?.lesson_type_iterate_count;
          i++
        ) {
          lessonsToCreate.push({
            subject_id: subjectObject?.id,
            lesson_assessment_id: lessonAssessmentObject?.id,
            week_number: i + 1,
            lesson_number: i + 1,
            lesson_type_id: lessonAssessmentObject?.lesson_type?.id,
            convert_grade: lessonAssessmentObject?.default_grade,
          });
        }
      }
    }
  }

  await allModels.SubjectSchedule.bulkCreate(subjectSchedulesToCreate, options);

  if (lessonsToCreate.length > 0) {
    await allModels.Lesson.bulkCreate(lessonsToCreate, options);
  }

  return subjectObject;
};

const startSubjectService = async (datas, subjectId, user_id) => {
  // Fetch all lessons once based on all provided `data.id` and `subjectId`
  const lessonsToUpdate = await allModels.Lesson.findAll({
    where: {
      lesson_assessment_id: datas.map((data) => data.id),
      subject_id: subjectId,
    },
  });

  // Create a map of data.id to grade for quick lookup
  const gradeMap = new Map(datas.map((data) => [data.id, data.grade]));

  // Prepare bulk update data
  const updatePromises = lessonsToUpdate.map((lesson) => {
    const newGrade = gradeMap.get(lesson.lesson_assessment_id);
    if (newGrade) {
      return allModels.Lesson.update(
        { convert_grade: newGrade },
        { where: { id: lesson.id } }
      );
    }
  });

  // Execute all update promises
  await Promise.all(updatePromises);

  // Finally, update the subject status
  return await allModels.Subject.update(
    { is_started: true },
    { where: { id: subjectId } }
  );
};

const updateSubject = async (subjectId, data, userId, transaction) => {
  const options = { transaction };

  // Validate existence of subject before update
  const existingSubject = await allModels.Subject.findByPk(subjectId, options);
  if (!existingSubject) {
    throw new Error("Subject not found with the provided ID.");
  }

  // Start by updating the subject
  await allModels.Subject.update(
    {
      subject_name: data.subject_name,
      subject_code: data.subject_code,
    },
    { where: { id: subjectId }, ...options }
  );

  // To ensure consistency, remove the existing schedules and lessons first
  await allModels.SubjectSchedule.destroy({
    where: { subject_id: subjectId },
    ...options,
  });

  await allModels.Lesson.destroy({
    where: { subject_id: subjectId },
    ...options,
  });

  // As well as removing existing SubjectLessonType associations to avoid duplicates
  await allModels.SubjectLessonType.destroy({
    where: { subject_id: subjectId },
    ...options,
  });

  let subjectSchedulesToCreate = [];
  let lessonsToCreate = [];

  // Process each schedule in the updated data
  for (const subject_schedule of data.subject_schedules) {
    // Validate lesson type existence
    const lessonType = await allModels.LessonType.findByPk(
      subject_schedule.lesson_type_id,
      options
    );
    if (!lessonType) {
      throw new Error(
        `Lesson type not found with ID: ${subject_schedule.lesson_type_id}`
      );
    }

    // Create or recreate the lesson type associations
    await allModels.SubjectLessonType.create(
      {
        subject_id: subjectId,
        lesson_type_id: subject_schedule.lesson_type_id,
      },
      options
    );

    // Prepare schedules for bulk creation
    subject_schedule.schedule_ids.forEach((schedule_id) => {
      subjectSchedulesToCreate.push({
        subject_id: subjectId,
        lesson_type_id: subject_schedule.lesson_type_id,
        schedule_id,
      });
    });

    // Fetch lesson assessments
    const lessonAssessments = await allModels.LessonAssessment.findAll({
      where: {
        lesson_type_id: subject_schedule.lesson_type_id,
      },
      include: { model: allModels.LessonType },
      ...options,
    });

    // Add lessons based on lesson assessments
    lessonAssessments.forEach((assessment) => {
      for (
        let i = 0;
        i < assessment.lesson_type.lesson_type_iterate_count;
        i++
      ) {
        lessonsToCreate.push({
          subject_id: subjectId,
          lesson_assessment_id: assessment.id,
          week_number: i + 1,
          lesson_number: i + 1,
          lesson_type_id: assessment.lesson_type.id,
          convert_grade: assessment.default_grade,
        });
      }
    });
  }

  // Bulk create the new schedules and lessons
  await allModels.SubjectSchedule.bulkCreate(subjectSchedulesToCreate, options);
  if (lessonsToCreate.length > 0) {
    await allModels.Lesson.bulkCreate(lessonsToCreate, options);
  }

  return { message: "Subject updated successfully!" };
};

const deleteSubject = async (id, userId) => {
  await checkIfUserCorrect(id, userId);
  return await allModels.Subject.destroy({
    where: { id: id },
  });
};

async function checkIfUserCorrect(id, userId) {
  const isUserCorrect = await allModels.Subject.findOne({
    where: { id: id, teacher_user_id: userId },
  });

  if (!isUserCorrect) {
    const error = new Error("Зөвшөөрөлгүй хандалт.");
    error.statusCode = 403;
    throw error;
  }
}

module.exports = {
  getAllSubjects,
  createSubject,
  updateSubject,
  getSubjectById,
  deleteSubject,
  startSubjectService,
  getAllStudentsSubjectsService,
};
