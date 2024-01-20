const Subject = require('../models/subject');

const getAllSubjects = async () => {
  return await Subject.findAll();
};

module.exports = {
  getAllSubjects,
};
