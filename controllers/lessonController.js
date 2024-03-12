const lessonService = require("../services/lessonService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const { internalServerError } = require("../utils/responseUtil");

const getLessons = async (req, res, next) => {
  try {
    const userId = req.user && req.user.role_id;
    if (userId != 1 && userId != 2 && userId != 3) {
      return res.status(403).json({ message: "Authentication is required." });
    }

    const subjectId = req.body.subject_id ?? null;

    if (subjectId == null) {
        return res.status(400).json({"error": "subject_id -аа явуулаарай body-оороо."});
    }

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      userId: userId,
      subjectId: subjectId,
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
    internalServerError(res, error);
  }
};

const getLessonsWithoutBody = async (req, res, next) => {
  try {
    const lessons = await lessonService.getAllLessons({
      isWithoutBody: true,
    });
    res.json(lessons);
  } catch (error) {
    internalServerError(res, error);
  }
};

const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await lessonService.getLessonById(id);
    res.json(subject);
  } catch (error) {
    next(error);
  }
};

const createLesson = async (req, res, next) => {
  try {
    const newLesson = await lessonService.createLesson(req.body);
    res.status(201).json({ message: "Lesson created successfully", newLesson });
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedLesson = await lessonService.updateLesson(id, req.body);
    res
      .status(200)
      .json({ message: "Lesson updated successfully", updatedLesson });
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    await lessonService.deleteLesson(id);
    res.status(200).json({ message: "Lesson deleted successfully", id });
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  getLessons,
  getLessonsWithoutBody,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
