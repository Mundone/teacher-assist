const gradeService = require("../services/gradeService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const { internalServerError } = require("../utils/responseUtil");

const getGradesController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;

    const subjectId = req.body.subject_id ?? null;

    if (subjectId == null) {
        return res.status(400).json({"error": "subject_id -аа явуулаарай body-оороо."});
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

    // Transform grades into a structure grouped by students
    let studentData = {};
    grades.forEach(grade => {
      const { student, lesson, grade: gradeValue } = grade;
      if (!studentData[student.id]) {
        studentData[student.id] = {
          student_id: student.id,
          name: student.name,
          student_code: student.student_code,
          grades: {}
        };
      }
      studentData[student.id].grades[lesson.id] = {
        id: lesson.id,
        grade: gradeValue,
        week_number: lesson.week_number,
        lesson_number: lesson.lesson_number
      };
    });

    res.json({
      pagination: {
        current_page_no: pageNo + 1,
        total_pages: Math.ceil(totalGrades / pageSize),
        per_page: pageSize,
        total_elements: totalGrades
      },
      data: Object.values(studentData) // Convert the object to an array for the response
    });

    
    // res.json({
    //   pagination: {
    //     current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
    //     total_pages: Math.ceil(totalGrades / pageSize),
    //     per_page: pageSize,
    //     total_elements: totalGrades,
    //   },
    //   data: grades,
    // });
  } catch (error) {
    internalServerError(res, error);
  }
};



const updateGradeController = async (req, res) => {
  try {
    const { student_id, lesson_id, grade } = req.body;

    // You might want to add validation here to ensure the data is correct
    if (!student_id || !lesson_id || grade === undefined) {
      return res.status(400).json({ error: 'Missing studentId, lessonId, or grade in request body.' });
    }

    const result = await gradeService.updateGrade({ student_id, lesson_id, grade });

    res.json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getGradesController,
  updateGradeController,
};
