const scoreService = require("../services/scoreService");
const { Score } = require("../models");

const getScores = async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const { pageNo, pageSize, sortBy, sortOrder } = req.pagination;

    const subjectIdInt = parseInt(subjectId);

    if (isNaN(subjectIdInt)) {
      return res.status(400).json({ error: "Invalid subjectId." });
    }

    const { totalScores, scores } = await scoreService.getAllStudentScoresForSubject(
      subjectIdInt, pageNo, pageSize, sortBy, sortOrder
    );

    const totalPages = Math.ceil(totalScores / pageSize);

    res.json({
      pagination: {
        current_page_no: pageNo,
        total_pages: totalPages,
        per_page: pageSize,
        total_elements: totalScores,
      },
      sort: `${sortBy} ${sortOrder}`,
      data: scores,
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



const updateScore = async (req, res, next) => {
  try {
    const { scoreId } = req.params;
    const updatedScore = await scoreService.updateStudentScore(scoreId, req.body);
    res.json(updatedScore);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScores,
  updateScore,
};
