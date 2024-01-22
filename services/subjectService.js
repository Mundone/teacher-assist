// subjectService.js
const { Subject, Lab, Assignment, StudentEnrollment, LectureSchedule } = require("../models");
const { Sequelize } = require("sequelize");

const getAllSubjects = async (pageNo, pageSize, sortBy, sortOrder) => {
  const offset = pageNo * pageSize;
  const { count: totalSubjects, rows: subjects } = await Subject.findAndCountAll({
    attributes: {
      include: [
        [Sequelize.literal(`(SELECT COUNT(*) FROM Labs WHERE Labs.SubjectID = Subject.SubjectID)`), "labCount"],
        [Sequelize.literal(`(SELECT COUNT(*) FROM Assignments WHERE Assignments.SubjectID = Subject.SubjectID)`), "assignmentCount"],
        [Sequelize.literal(`(SELECT COUNT(*) FROM StudentEnrollments WHERE StudentEnrollments.SubjectID = Subject.SubjectID)`), "studentCount"],
      ],
    },
    include: [
      { model: LectureSchedule, as: "LectureSchedules" },
      { model: Lab, as: "Labs" },
      { model: Assignment, as: "Assignments" },
    ],
    group: ["Subject.SubjectID"],
    limit: pageSize,
    offset: offset,
    order: [[sortBy === "id" ? "SubjectID" : sortBy, sortOrder]],
  });

  return {
    totalSubjects, // This will be a single number
    subjects,
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
