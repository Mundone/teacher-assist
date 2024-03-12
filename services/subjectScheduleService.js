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

  const isUserIncludeSchedule = await allModels.Subject.findOne({
    where: { id: subjectId, user_id: userId },
  }).then((ss) => {
    if (ss != null) {
      return true;
    }
    return false;
  });

  if (!isUserIncludeSchedule) {
    const error = new Error("Зөвшөөрөлгүй хандалт.");
    error.statusCode = 403;
    throw error;
  }

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
          where: { id: subjectId},
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

// Service
const createSubjectSchedule = async (subjectScheduleData, user_id) => {
  // Add the user_id to the subjectScheduleData object
  return await allModels.SubjectSchedule.create({
    ...subjectScheduleData,
    user_id,
  });
};

const updateSubjectSchedule = async (id, subjectScheduleData) => {
  return await allModels.SubjectSchedule.update(subjectScheduleData, {
    where: { id: id },
  });
};

const getSubjectScheduleById = async (id) => {
  return await allModels.SubjectSchedule.findByPk(id);
};

const deleteSubjectSchedule = async (id) => {
  return await allModels.SubjectSchedule.destroy({
    where: { id: id },
  });
};

module.exports = {
  getAllSubjectSchedules,
  createSubjectSchedule,
  updateSubjectSchedule,
  getSubjectScheduleById,
  deleteSubjectSchedule,
};
