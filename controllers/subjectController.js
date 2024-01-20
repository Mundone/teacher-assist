const SubjectService = require('../services/subjectService');

exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await SubjectService.getAllSubjects();
    res.json(subjects);
  } catch (error) {
    next(error);
  }
};
