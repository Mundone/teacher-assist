const lessonAssessmentService = require("../services/lessonAssessmentService");
const buildWhereOptions = require("../utils/sequelizeUtil");

const getLessonAssessments = async (req, res, next) => {
  try {
    const userId = req.user && req.user.role_id;

    console.log(req.user);

    if (userId != 1) {
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

    const { totalLessonAssessments, lessonAssessments } =
      await lessonAssessmentService.getAllLessonAssessments(
        queryOptions
      );
      
      res.json({
        pagination: {
          current_page_no: pageNo + 1,
          total_pages: Math.ceil(totalLessonAssessments / pageSize),
          per_page: pageSize,
          total_elements: totalLessonAssessments,
        },
        data: lessonAssessments,
      });
  } catch (error) {
    console.error("Error fetching lessonAssessments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLessonAssessmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await lessonAssessmentService.getLessonAssessmentById(id);
    if (!student) {
      return res.status(404).json({ message: "LessonAssessment not found" });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};

const createLessonAssessment = async (req, res, next) => {
  try {
    const newStudent = await lessonAssessmentService.createLessonAssessment(
      req.body
    );
    res.status(201).json(newStudent);
  } catch (error) {
    next(error);
  }
};

const updateLessonAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await lessonAssessmentService.updateLessonAssessment(id, req.body);
    res.json({ message: "LessonAssessment updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteLessonAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await lessonAssessmentService.deleteLessonAssessment(id);
    res.json({ message: "LessonAssessment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLessonAssessments,
  getLessonAssessmentById,
  createLessonAssessment,
  updateLessonAssessment,
  deleteLessonAssessment,
};
