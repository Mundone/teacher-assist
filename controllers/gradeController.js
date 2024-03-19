const gradeService = require("../services/gradeService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getGradesController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;

    const subjectId = req.body.subject_id ?? null;

    if (subjectId == null) {
      return res
        .status(400)
        .json({ error: "subject_id -аа явуулаарай body-оороо." });
    }

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      userId: userId,
      subjectId: subjectId,
    };

    const { totalGrades, grades } = await gradeService.getAllStudentGrades(
      queryOptions
    );

    const newGrades = grades.map((grade) => {
      const lessonTypeName =
        grade?.lesson_assessment?.lesson_type?.lesson_type_name;
      const lessonAssessmentCode =
        grade?.lesson_assessment?.lesson_assessment_code;
      const students = grade?.grades.map((innerGrade) => {
        return {
          grade_id: innerGrade?.id,
          student_name: innerGrade?.student?.name,
          student_code: innerGrade?.student?.student_code,
          grade: innerGrade?.grade,
        };
      });

      return {
        lesson_type_name: lessonTypeName,
        week_number: grade?.week_number,
        lessonAssessmentCode: lessonAssessmentCode,
        students: students,
      };
    });

    res.json({
      pagination: {
        current_page_no: pageNo + 1,
        total_pages: Math.ceil(totalGrades / pageSize),
        per_page: pageSize,
        total_elements: totalGrades,
      },
      // data: grades,
      data: newGrades,
    });
  } catch (error) {
    responses.internalServerError(res, error);
  }
};

const updateGradeController = async (req, res) => {
  try {
    const { student_id, lesson_id, grade } = req.body;

    // You might want to add validation here to ensure the data is correct
    if (!student_id || !lesson_id || grade === undefined) {
      return res.status(400).json({
        error: "Missing studentId, lessonId, or grade in request body.",
      });
    }

    const result = await gradeService.updateGrade({
      student_id,
      lesson_id,
      grade,
    });

    res.json({ message: result.message });
  } catch (error) {
    responses.internalServerError(res, error);
  }
};

module.exports = {
  getGradesController,
  updateGradeController,
};
