const allModels = require("../models");

const getAllSubjectSchedules = async ({
  where,
  limit,
  offset,
  order,
  userId,
  subjectId,
  isWithoutBody,
}) => {
  await checkIfUserCorrect(subjectId, userId);

  if (isWithoutBody) {
    return await allModels.SubjectSchedule.findAll({
      attributes: [
        "id",
        "subject_id",
        "lesson_type_id",
        "lecture_day",
        "lecture_time",
        "createdAt",
      ],
      include: [
        {
          model: allModels.Subject,
          attributes: ["id", "subject_name"],
          where: { id: subjectId },
        },
        {
          model: allModels.LessonType,
          attributes: ["id", "lesson_type_name"],
        },
      ],
    });
  }

  let { count: totalSubjectSchedules, rows: subjectSchedules } =
    await allModels.SubjectSchedule.findAndCountAll({
      // include: [
      //   {
      //     model: allModels.SubjectLessonType,
      //     attributes: ["lesson_type_id"], // Include other necessary fields from the join table if needed
      //     include: [{
      //       model: allModels.LessonType,
      //       attributes: ["lesson_type_name"] // Adjust "name" to the actual field name of the lesson type's name
      //     }]
      //   },
      // ],
      include: [
        {
          model: allModels.Subject,
          attributes: ["id", "subject_name"], // Include other necessary fields from the join table if needed
          where: { id: subjectId },
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
        "lecture_day",
        "lecture_time",
        "createdAt",
      ],

      where: where, // Use the where options built from filters
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

  return {
    totalSubjectSchedules,
    subjectSchedules,
  };
};

const getSubjectScheduleById = async (id, userId) => {
  const returnObject = await allModels.SubjectSchedule.findByPk(id, {
    attributes: [
      "id",
      "subject_id",
      "lesson_type_id",
      "lecture_day",
      "lecture_time",
      "createdAt",
    ],
  });

  await checkIfUserCorrect(returnObject.subject_id, userId);
  return returnObject;
};

// Service
const createSubjectSchedule = async (
  subjectScheduleData,
   userId
) => {
  // Add the user_id to the subjectScheduleData object
  const returnObject = await allModels.Lesson.findByPk(subjectScheduleData.subject_id);
  await checkIfUserCorrect(returnObject.subject_id, userId);
  return await allModels.SubjectSchedule.create({
    ...subjectScheduleData,
    // user_id,
  });
};

const updateSubjectSchedule = async (id, subjectScheduleData, userId) => {
  const returnObject = await allModels.Lesson.findByPk(id);
  await checkIfUserCorrect(returnObject.subject_id, userId);
  const { subject_id, ...updateData } = subjectScheduleData;
  return await allModels.SubjectSchedule.update(updateData, {
    where: { id: id },
  });
};

const deleteSubjectSchedule = async (id, userId) => {
  const returnObject = await allModels.Lesson.findByPk(id);
  await checkIfUserCorrect(returnObject.subject_id, userId);
  return await allModels.SubjectSchedule.destroy({
    where: { id: id },
  });
};

async function checkIfUserCorrect(subjectId, userId) {
  const isUserCorrect = await allModels.Subject.findOne({
    where: { id: subjectId, user_id: userId },
  });

  if (!isUserCorrect) {
    throw new Error("Зөвшөөрөлгүй хандалт.", { statusCode: 403 });
  }
}

module.exports = {
  getAllSubjectSchedules,
  createSubjectSchedule,
  updateSubjectSchedule,
  getSubjectScheduleById,
  deleteSubjectSchedule,
};
