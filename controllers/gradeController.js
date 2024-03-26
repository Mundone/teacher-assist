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

    const students = grades;

    var newStudents = students.map((student) => {
      const grades = student?.grades.map((innerGrade) => {
        return {
          grade_id: innerGrade?.id,
          grade: innerGrade?.grade,
          week_no: innerGrade?.lesson?.week_number,
          lesson_no: innerGrade?.lesson?.lesson_number,
          lesson_assessment_code:
            innerGrade?.lesson?.lesson_assessment.lesson_assessment_code,
          lesson_type_name:
            innerGrade?.lesson?.lesson_assessment.lesson_type.lesson_type_name,
        };
      });

      return {
        student_name: student.name,
        student_code: student.student_code,
        grades: grades,
      };
    });

    // console.log(newStudents);

    newStudents.forEach((student) => {
      student.grades.sort((a, b) => {
        if (a.lesson_type_name !== b.lesson_type_name) {
          return a.lesson_type_name.localeCompare(b.lesson_type_name);
        } else if (a.week_no !== b.week_no) {
          return a.week_no - b.week_no;
        } else if (a.lesson_no !== b.lesson_no) {
          return a.lesson_no - b.lesson_no;
        } else {
          return a.lesson_assessment_code.localeCompare(
            b.lesson_assessment_code
          );
        }
      });
    });

    console.log(newStudents);

    const headerData = newStudents.map((newStudent) => ({
      grades: newStudent.grades.map(
        ({ week_no, lesson_no, lesson_assessment_code, lesson_type_name }) => ({
          lesson_type_name,
          week_no,
          lesson_no,
          lesson_assessment_code,
        })
      ),
    }));

    const tableData = newStudents.map((newStudent) => ({
      student_name: newStudent.student_name,
      student_code: newStudent.student_code,
      grades: newStudent.grades.map(({ grade_id, grade }) => ({
        grade_id,
        grade,
      })),
    }));

    res.json({
      pagination: {
        current_page_no: pageNo + 1,
        total_pages: Math.ceil(totalGrades / pageSize),
        per_page: pageSize,
        total_elements: totalGrades,
      },
      // data: students,
      table_header: headerData[0]?.grades,
      table_data: tableData,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const updateGradeController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user && req.user.id;

    await gradeService.updateGrade(id, req.body, userId);
    responses.updated(res, req.body);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getGradesController,
  updateGradeController,
};
