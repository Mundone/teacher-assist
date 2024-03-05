// subjectController.js
const lessonService = require("../services/lessonService");

exports.getLessons = async (req, res, next) => {
  try {
    const { pageNo, pageSize, sortBy, sortOrder } = req.pagination;
    const { totalLessons, lessons } = await lessonService.getAllLessons(pageNo, pageSize, sortBy, sortOrder);

    res.json({
      pagination: {
        current_page_no: pageNo,
        total_pages: Math.ceil(totalLessons / pageSize),
        per_page: pageSize,
        // total_elements: totalLessons,
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
