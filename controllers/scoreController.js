const scoreService = require("../services/scoreService");
const { Score } = require("../models");

const getScores = async (req, res, next) => {
  try {
    const { subjectId, week } = req.query;
    const { pageNo, pageSize, sortBy, sortOrder } = req.pagination; // Using pagination from middleware

    const subjectIdInt = parseInt(subjectId);
    const weekInt = parseInt(week);

    // Validate the query parameters
    if (isNaN(subjectIdInt) || isNaN(weekInt)) {
      return res.status(400).json({ error: "Invalid subjectId or week." });
    }

    // Get the total count of scores for pagination
    const totalElements = await Score.count({
      where: { SubjectID: subjectIdInt },
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalElements / pageSize);

    // Fetch paginated scores with sorting
    const scores = await scoreService.getAllStudentScoresForSubjectAndWeek(
      subjectIdInt, weekInt, pageNo, pageSize, sortBy, sortOrder
    );

    // Respond with paginated and sorted scores
    res.json({
      pagination: {
        current_page_no: pageNo,
        total_pages: totalPages,
        per_page: pageSize,
        total_elements: totalElements,
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
