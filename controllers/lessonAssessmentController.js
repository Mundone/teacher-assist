const lessonAssessmentService = require("../services/lessonAssessmentService");

const getLessonAssessments = async (req, res, next) => {
  try {
    const { pageNo, pageSize, sortBy, sortOrder } = req.pagination;
    const { totalLessonAssessments, lessonAssessments } =
      await lessonAssessmentService.getAllLessonAssessments(
        pageNo,
        pageSize,
        sortBy,
        sortOrder
      );
      console.log(totalLessonAssessments);

      res.json({
        pagination: {
          current_page_no: pageNo,
          total_pages: Math.ceil(totalLessonAssessments / pageSize),
          per_page: pageSize,
          // total_elements: totalSubjects,
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
