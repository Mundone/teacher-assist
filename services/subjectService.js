const allModels = require("../models");

const getAllSubjects = async ({ where, limit, offset, order }) => {

  let { count: totalSubjects, rows: subjects } =
    await allModels.Subject.findAndCountAll({
      include: [
        {
          model: allModels.SubjectLessonType,
          attributes: ["lesson_type_id"], // Include other necessary fields from the join table if needed
          include: [{
            model: allModels.LessonType,
            attributes: ["lesson_type_name"] // Adjust "name" to the actual field name of the lesson type's name
          }]
        },
      ],
      attributes: [
        "id",
        "subject_name",
        "createdAt",
      ],

      where: where, // Use the where options built from filters
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

// Service
const createSubject = async (subjectData, user_id) => {
  // Add the user_id to the subjectData object
  return await Subject.create({ ...subjectData, user_id });
};


const updateSubject = async (id, subjectData) => {
  return await Subject.update(subjectData, {
    where: { id: id },
  });
};

const getSubjectById = async (id) => {
  return await Subject.findByPk(id);
};

const deleteSubject = async (id) => {
  return await Subject.destroy({
    where: { id: id },
  });
};

module.exports = {
  getAllSubjects,
  createSubject,
  updateSubject,
  getSubjectById,
  deleteSubject,
};
