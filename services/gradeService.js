const allModels = require("../models");

const getAllStudentGrades = async ({
  where,
  limit,
  offset,
  order,
  userId,
  subjectId,
}) => {
  const isUserIncludeSubject = await allModels.Subject.findOne({
    where: { id: subjectId, user_id: userId },
  });

  if (!isUserIncludeSubject) {
    throw new Error("Зөвшөөрөлгүй хандалт.", { statusCode: 403 });
  }

  let { count: totalGrades, rows: grades } =
    await allModels.Student.findAndCountAll({
      include: [
        {
          model: allModels.Grade,
          attributes: [
            // "id",
            // "student_id",
            //  "lesson_id",
            "grade",
          ],

          include: {
            model: allModels.Lesson,
            attributes: [
              // "id",
              // "subject_id",
              "lesson_assessment_id",
              "week_number",
              // "lesson_number",
              "createdAt",
              // "lesson_type_id",
            ],
            include: {
              model: allModels.LessonAssessment,
              attributes: ["lesson_type_id"],
              include: {
                model: allModels.LessonType,
                attributes: ["id", "lesson_type_name"],
              },
            },
            where: { subject_id: subjectId },
            
          },
        },
      ],
      attributes: ["id", "name", "student_code", "createdAt"],

      where: where,
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

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

  return {
    totalGrades,
    grades,
  };
};

const updateGrade = async ({ student_id, lesson_id, grade }) => {
  try {
    const result = await allModels.Grade.update(
      { grade },
      {
        where: {
          student_id: student_id,
          lesson_id: lesson_id,
        },
      }
    );

    if (result[0] > 0) {
      return { message: "Grade updated successfully." };
    } else {
      throw new Error("Grade not found or no changes made.");
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllStudentGrades,
  updateGrade,
};
