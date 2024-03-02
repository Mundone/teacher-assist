// subjectService.js
const { Subject, Lab, Assignment, StudentEnrollment, LectureSchedule } = require("../models");
const { Sequelize } = require("sequelize");

const getAllSubjects = async (pageNo, pageSize, sortBy, sortOrder) => {
  const offset = pageNo * pageSize;
  const { count: totalSubjects, rows: subjects } = await Subject.findAndCountAll({
    attributes: {
      include: [
        [Sequelize.literal(`(SELECT COUNT(*) FROM lab WHERE lab.subject_id = subject.id)`), "labCount"],
        [Sequelize.literal(`(SELECT COUNT(*) FROM assignment WHERE assignment.subject_id = subject.id)`), "assignmentCount"],
        [Sequelize.literal(`(SELECT COUNT(*) FROM student_enrollment WHERE student_enrollment.subject_id = subject.id)`), "studentCount"],
      ],
    },
    include: [
      { model: LectureSchedule },
      { model: Lab },
      { model: Assignment },
    ],
    group: ["subject.id"],
    limit: pageSize,
    offset: offset,
    order: [[sortBy === "id" ? "subject_id" : sortBy, sortOrder]],
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
