const lessonAssessmentService = require("../services/lessonAssessmentService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

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
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
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
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getLessonAssessmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const object = await lessonAssessmentService.getLessonAssessmentById(id);
    if (!object) {
      // return res.status(404).json({ message: "LessonAssessment not found" });
      responses.notFound(res);
    }
    res.json(object);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const createLessonAssessment = async (req, res, next) => {
  try {
    const newObject = await lessonAssessmentService.createLessonAssessment(
      req.body
    );
    responses.created(res, newObject);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const updateLessonAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await lessonAssessmentService.updateLessonAssessment(id, req.body);
    responses.updated(res, req.body);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const deleteLessonAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await lessonAssessmentService.deleteLessonAssessment(id);
    responses.deleted(res, { id: id });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getDefaultConvertGradesBySubjectController = async (req, res, next) => {
  try {
    const { subject_id } = req.params;
    const object =
      await lessonAssessmentService.getDefaultConvertGradesBySubjectService(
        subject_id
      );
    res.json(
      object.map((data) => {
        return { ...data.dataValues, grade: data.default_grade }; // Assuming you want to increase grade by 10%
      })
    );
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getLessonAssessments,
  getLessonAssessmentsWithoutBody,
  getLessonAssessmentById,
  createLessonAssessment,
  updateLessonAssessment,
  deleteLessonAssessment,
  getDefaultConvertGradesBySubjectController,
};
