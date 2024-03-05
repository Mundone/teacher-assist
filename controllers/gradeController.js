const gradeService = require("../services/gradeService");
const { Grade } = require("../models");

const getGrades = async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const { pageNo, pageSize, sortBy, sortOrder } = req.pagination;

    const subjectIdInt = parseInt(subjectId);

    if (isNaN(subjectIdInt)) {
      return res.status(400).json({ error: "Invalid subjectId." });
    }

    const { totalScores, grades } = await gradeService.getAllStudentScoresForSubject(
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
      data: grades,
    });
  } catch (error) {
    console.error('Error fetching grades:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



const updateScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedScore = await gradeService.updateStudentScore(id, req.body);
    res.json(updatedScore);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGrades,
  updateScore,
};
