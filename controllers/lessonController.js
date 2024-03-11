const lessonService = require("../services/lessonService");
const buildWhereOptions = require("../utils/sequelizeUtil");

exports.getLessons = async (req, res, next) => {
  try {
    
    const userId = req.user && req.user.role_id;
    if (userId != 1 && userId != 2 && userId != 3 ) {
      return res.status(403).json({ message: 'Authentication is required.' });
    }

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      userId: userId
    };

    // console.log(req);

    const { totalLessons, lessons } = await lessonService.getAllLessons(
      queryOptions
    );

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalLessons / pageSize),
        per_page: pageSize,
        total_elements: totalLessons,
      },
      data: lessons,
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createLesson = async (req, res, next) => {
  try {
    const newLesson = await lessonService.createLesson(req.body);
    res.status(201).json(newLesson);
  } catch (error) {
    next(error);
  }
};

exports.updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    await lessonService.updateLesson(id, req.body);
    res.status(200).json({ message: "Lesson updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await lessonService.getLessonById(id);
    res.json(subject);
  } catch (error) {
    next(error);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    await lessonService.deleteLesson(id);
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    next(error);
  }
};
