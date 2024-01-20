const ScoreService = require('../services/scoreService');

const getScores = async (req, res, next) => {
  try {
    const scores = await ScoreService.getAllScores();
    res.json(scores);
  } catch (error) {
    next(error);
  }
};

const getStudentScores = async (req, res, next) => {
  try {
    const { studentId, subjectId } = req.query;
    const scores = await ScoreService.getStudentSubjectScores(studentId, subjectId);
    res.json(scores);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScores,
  getStudentScores,
};
