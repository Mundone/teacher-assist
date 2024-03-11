const lessonTypeService = require('../services/lessonTypeService');
const buildWhereOptions = require("../utils/sequelizeUtil");


const getLessonTypes = async (req, res, next) => {
  try {
    const userId = req.user && req.user.role_id;
    if (userId != 1 ) {
      return res.status(403).json({ message: 'Authentication is required.' });
    }
    
    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    const { totalLessonTypes, lessonTypes } = await lessonTypeService.getAllLessonTypes(
      queryOptions
    );

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalLessonTypes / pageSize),
        per_page: pageSize,
        total_elements: totalLessonTypes,
      },
      data: lessonTypes,
    });
  } catch (error) {
    console.error("Error fetching lessonTypes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getLessonTypes
};