const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getAllSubjects = async (pageNo, pageSize, sortBy, sortOrder) => {
  const offset = pageNo * pageSize;
  const { count: totalSubjects, rows: subjects } =
    await allModels.Subject.findAndCountAll({
      include: [{
        model: allModels.Teacher, // Ensure you have imported your allModels at the top of the file
        // as: 'Teachers', // Use the alias you defined in your association, if applicable
        through: { attributes: [] }, // This ensures only teacher info is returned, not join table info
        attributes: ['id', 'name', 'email', 'code'], // Specify the teacher attributes you want
      }],
      limit: pageSize,
      offset: offset,
      order: [[sortBy, sortOrder]],
      distinct: true, // This ensures count is accurate when including many-to-many relationships
    });

  return {
    totalSubjects,
    subjects: subjects.map(subject => {
      // Optionally, format the subject data as needed before returning
      return {
        ...subject.get({ plain: true }), // This normalizes the Sequelize object
        // Add or transform any subject data here if needed
      };
    }),
  };
};


const createSubject = async (subjectData) => {
  return await Subject.create(subjectData);
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
