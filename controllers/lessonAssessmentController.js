const lessonAssessmentService = require("../services/lessonAssessmentService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const { internalServerError } = require('../utils/responseUtil');

const getLessonAssessments = async (req, res, next) => {
  try {

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    const { totalLessonAssessments, lessonAssessments } =
      await lessonAssessmentService.getAllLessonAssessments(queryOptions);

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
    internalServerError(res, error);
  }
};

const getLessonAssessmentsWithoutBody = async (req, res, next) => {
  try {
    const lessonAssessments =
      await lessonAssessmentService.getAllLessonAssessments({
        isWithoutBody: true,
      });
    res.json(lessonAssessments);
  } catch (error) {
    internalServerError(res, error);
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
    internalServerError(res, error);
  }
};

const createLessonAssessment = async (req, res, next) => {
  try {
    const newLessonAssessment = await lessonAssessmentService.createLessonAssessment(
      req.body
    );
    res.status(201).json({ message: "LessonAssessment created successfully", newLessonAssessment });
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateLessonAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStudent = await lessonAssessmentService.updateLessonAssessment(id, req.body);
    res.json({ message: "LessonAssessment updated successfully", updatedStudent });
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteLessonAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await lessonAssessmentService.deleteLessonAssessment(id);
    res.json({ message: "LessonAssessment deleted successfully", id });
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  getLessonAssessments,
  getLessonAssessmentsWithoutBody,
  getLessonAssessmentById,
  createLessonAssessment,
  updateLessonAssessment,
  deleteLessonAssessment,
};
