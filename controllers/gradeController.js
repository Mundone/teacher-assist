const gradeService = require("../services/gradeService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getGradesController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;

    const subjectId = req.body.subject_id ?? null;
    const lessonTypeId = req.body.lesson_type_id ?? null;

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
      lessonTypeId: lessonTypeId,
    };

    const { totalGrades, grades } =
      await gradeService.getAllStudentGradesService(queryOptions);
    const students = grades;
    console.log(grades);

    var newStudents = students.map((student) => {
      const grades = student?.grades.map((innerGrade) => {
        return {
          grade_id: innerGrade?.id,
          grade: innerGrade?.grade,
          week_no: innerGrade?.lesson?.week_number,
          lesson_no: innerGrade?.lesson?.lesson_number,
          lesson_assessment_code:
            innerGrade?.lesson?.lesson_assessment.lesson_assessment_code,
          lesson_assessment_sort:
            innerGrade?.lesson?.lesson_assessment.lesson_assessment_sort,
          lesson_type_name: innerGrade?.lesson?.lesson_type.lesson_type_name,
          lesson_type_sort: innerGrade?.lesson?.lesson_type.lesson_type_sort,
        };
      });

      // Aggregating grade sums by lesson type and assessment code
      const gradeSumsByLessonTypeAndAssessment = grades.reduce(
        (acc, currentGrade) => {
          // const key = `${currentGrade.lesson_type_name} | ${currentGrade.lesson_assessment_code}`;
          const key = currentGrade.lesson_assessment_code;
          acc[key] = (acc[key] || 0) + currentGrade.grade;
          return acc;
        },
        {}
      );

      return {
        student_name: student.name,
        student_code: student.student_code,
        grades: grades,
        gradeSumsByLessonTypeAndAssessment: gradeSumsByLessonTypeAndAssessment,
      };
    });

    newStudents.forEach((student) => {
      student.grades.sort((a, b) => {
        if (a.lesson_type_sort !== b.lesson_type_sort) {
          return a.lesson_type_sort - b.lesson_type_sort;
        } else if (a.week_no !== b.week_no) {
          return a.week_no - b.week_no;
        } else if (a.lesson_no !== b.lesson_no) {
          return a.lesson_no - b.lesson_no;
        } else {
          return a.lesson_assessment_sort - b.lesson_assessment_sort;
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
      gradeSumsByLessonTypeAndAssessment:
        newStudent.gradeSumsByLessonTypeAndAssessment,
    }));

    res.json({
      pagination: {
        current_page_no: pageNo + 1,
        total_pages: Math.ceil(totalGrades / pageSize),
        per_page: pageSize,
        total_elements: totalGrades,
      },
      table_header: headerData[0]?.grades,
      table_data: tableData,
    });
    // res.json({grades})
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getDirectConvertedGradesController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;

    const subjectId = req.body.subject_id ?? null;
    // const lessonTypeId = req.body.lesson_type_id ?? null;

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;
    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      userId: userId,
      subjectId: subjectId,
      // lessonTypeId: lessonTypeId,
    };

    const { grades } = await gradeService.getAllStudentGradesService(
      queryOptions
    );
    const students = grades;

    let maxGrades = {};

    var newStudents = students.map((student) => {
      const grades = student?.grades.map((innerGrade) => {
        return {
          grade_id: innerGrade?.id,
          grade: innerGrade?.grade,
          week_no: innerGrade?.lesson?.week_number,
          lesson_no: innerGrade?.lesson?.lesson_number,
          lesson_assessment_code:
            innerGrade?.lesson?.lesson_assessment.lesson_assessment_code,
          lesson_assessment_sort:
            innerGrade?.lesson?.lesson_assessment.lesson_assessment_sort,
          lesson_type_name: innerGrade?.lesson?.lesson_type.lesson_type_name,
          lesson_type_sort: innerGrade?.lesson?.lesson_type.lesson_type_sort,
          convert_grade: innerGrade?.lesson?.convert_grade,
        };
      });

      const grade_sums_by_assessment = grades.reduce((acc, currentGrade) => {
        const key = currentGrade.lesson_assessment_code;
        const currentSum = (acc[key] || 0) + currentGrade.grade;
        acc[key] = currentSum;
        maxGrades[key] = Math.max(maxGrades[key] || 0, currentSum);
        return acc;
      }, {});

      return {
        student_name: student.name,
        student_code: student.student_code,
        grades: grades,
        grade_sums_by_assessment: grade_sums_by_assessment,
      };
    });

    newStudents.forEach((student) => {
      student.grades.forEach((grade) => {
        const maxGradeSum = maxGrades[grade.lesson_assessment_code];
        if (maxGradeSum > 0) {
          const conversionCoefficient = grade.convert_grade / maxGradeSum;
          grade.convertedGrade = grade.grade * conversionCoefficient;
        } else {
          // Set converted grade to 0 if maxGradeSum is zero
          grade.convertedGrade = 0;
        }
      });

      // Set converted_sum to the lesson's convert_grade for each assessment
      student.grade_sums_by_assessment = student.grades.reduce((acc, grade) => {
        const key = grade.lesson_assessment_code;
        acc[key] = acc[key] || {
          original_sum: 0,
          converted_sum: grade.convert_grade,
        };
        acc[key].original_sum += grade.grade;
        return acc;
      }, {});
    });

    newStudents.forEach((student) => {
      student.grades.sort((a, b) => {
        if (a.lesson_type_sort !== b.lesson_type_sort) {
          return a.lesson_type_sort - b.lesson_type_sort;
        } else if (a.week_no !== b.week_no) {
          return a.week_no - b.week_no;
        } else if (a.lesson_no !== b.lesson_no) {
          return a.lesson_no - b.lesson_no;
        } else {
          return a.lesson_assessment_sort - b.lesson_assessment_sort;
        }
      });
    });

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
      // grades: newStudent.grades.map(({ grade_id, convertedGrade }) => ({
      //   grade_id,
      //   grade: convertedGrade, // Only return converted grades
      // })),
      grade_sums_by_assessment: newStudent.grade_sums_by_assessment,
    }));

    // res.json({
    //   table_header: headerData[0]?.grades,
    //   table_data: tableData,
    // });

    res.json({
      // table_header: headerData[0]?.grades,
      table_data: tableData,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getStudentOwnGradesController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;

    const subjectId = req.body.subject_id ?? null;

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;
    let queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      userId: userId,
      subjectId: subjectId,
    };

    queryOptions.where.push({});

    const { grades } = await gradeService.getAllStudentGradesService(
      queryOptions
    );
    const students = grades;

    let maxGrades = {};

    var newStudents = students.map((student) => {
      const grades = student?.grades.map((innerGrade) => {
        return {
          grade_id: innerGrade?.id,
          grade: innerGrade?.grade,
          week_no: innerGrade?.lesson?.week_number,
          lesson_no: innerGrade?.lesson?.lesson_number,
          lesson_assessment_code:
            innerGrade?.lesson?.lesson_assessment.lesson_assessment_code,
          lesson_assessment_sort:
            innerGrade?.lesson?.lesson_assessment.lesson_assessment_sort,
          lesson_type_name: innerGrade?.lesson?.lesson_type.lesson_type_name,
          lesson_type_sort: innerGrade?.lesson?.lesson_type.lesson_type_sort,
          convert_grade: innerGrade?.lesson?.convert_grade,
        };
      });

      const grade_sums_by_assessment = grades.reduce((acc, currentGrade) => {
        const key = currentGrade.lesson_assessment_code;
        const currentSum = (acc[key] || 0) + currentGrade.grade;
        acc[key] = currentSum;
        maxGrades[key] = Math.max(maxGrades[key] || 0, currentSum);
        return acc;
      }, {});

      return {
        student_name: student.name,
        student_code: student.student_code,
        grades: grades,
        grade_sums_by_assessment: grade_sums_by_assessment,
      };
    });

    newStudents.forEach((student) => {
      student.grades.forEach((grade) => {
        const maxGradeSum = maxGrades[grade.lesson_assessment_code];
        if (maxGradeSum > 0) {
          const conversionCoefficient = grade.convert_grade / maxGradeSum;
          grade.convertedGrade = grade.grade * conversionCoefficient;
        } else {
          // Set converted grade to 0 if maxGradeSum is zero
          grade.convertedGrade = 0;
        }
      });

      // Set converted_sum to the lesson's convert_grade for each assessment
      student.grade_sums_by_assessment = student.grades.reduce((acc, grade) => {
        const key = grade.lesson_assessment_code;
        acc[key] = acc[key] || {
          original_sum: 0,
          converted_sum: grade.convert_grade,
        };
        acc[key].original_sum += grade.grade;
        return acc;
      }, {});
    });

    newStudents.forEach((student) => {
      student.grades.sort((a, b) => {
        if (a.lesson_type_sort !== b.lesson_type_sort) {
          return a.lesson_type_sort - b.lesson_type_sort;
        } else if (a.week_no !== b.week_no) {
          return a.week_no - b.week_no;
        } else if (a.lesson_no !== b.lesson_no) {
          return a.lesson_no - b.lesson_no;
        } else {
          return a.lesson_assessment_sort - b.lesson_assessment_sort;
        }
      });
    });

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
      grades: newStudent.grades.map(({ grade_id, convertedGrade }) => ({
        grade_id,
        grade: convertedGrade, // Only return converted grades
      })),
      grade_sums_by_assessment: newStudent.grade_sums_by_assessment,
    }));

    res.json({
      table_header: headerData[0]?.grades,
      table_data: tableData,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const updateGradeController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user && req.user.id;

    await gradeService.updateGradeService(id, req.body, userId);
    responses.updated(res, req.body);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getSDConvertedGradesController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const subjectId = req.body.subject_id ?? null;

    const queryOptions = {
      userId: userId,
      subjectId: subjectId,
    };

    const { grades } = await gradeService.getAllStudentGradesService(
      queryOptions
    );
    let students = grades;

    let maxGrades = {};
    let sumGrades = {};
    let countGrades = {};

    // Initialize data for each student
    const newStudents = students.map((student) => {
      const gradeSums = {};
      const grades = student.grades.map((innerGrade) => {
        const assessmentCode =
          innerGrade.lesson.lesson_assessment.lesson_assessment_code;
        gradeSums[assessmentCode] = gradeSums[assessmentCode] || {
          original_sum: 0,
          converted_sum: 0,
        };
        gradeSums[assessmentCode].original_sum += innerGrade.grade;
        maxGrades[assessmentCode] = Math.max(
          maxGrades[assessmentCode] || 0,
          gradeSums[assessmentCode].original_sum
        );
        sumGrades[assessmentCode] =
          (sumGrades[assessmentCode] || 0) + innerGrade.grade;
        countGrades[assessmentCode] = (countGrades[assessmentCode] || 0) + 1;
        return {
          grade_id: innerGrade.id,
          grade: innerGrade.grade,
          week_no: innerGrade.lesson.week_number,
          lesson_no: innerGrade.lesson.lesson_number,
          lesson_assessment_code: assessmentCode,
          lesson_assessment_sort:
            innerGrade.lesson.lesson_assessment.lesson_assessment_sort,
          lesson_type_name: innerGrade.lesson.lesson_type.lesson_type_name,
          lesson_type_sort: innerGrade.lesson.lesson_type.lesson_type_sort,
          convert_grade: innerGrade.lesson.convert_grade,
        };
      });

      return {
        student_name: student.name,
        student_code: student.student_code,
        grades,
        grade_sums_by_assessment: gradeSums,
      };
    });

    // Calculate averages and standard deviations
    let avgGrades = {};
    let stdDeviations = {};
    Object.keys(sumGrades).forEach((key) => {
      avgGrades[key] = sumGrades[key] / countGrades[key];
      let variance = 0;
      newStudents.forEach((student) => {
        if (student.grade_sums_by_assessment[key]) {
          variance += Math.pow(
            student.grade_sums_by_assessment[key].original_sum - avgGrades[key],
            2
          );
        }
      });
      stdDeviations[key] = Math.sqrt(variance / countGrades[key]);
    });

    // Convert grades using standard deviation
    newStudents.forEach((student) => {
      student.grades.forEach((grade) => {
        const maxGradeSum = maxGrades[grade.lesson_assessment_code];
        const stdDev = stdDeviations[grade.lesson_assessment_code];
        if (maxGradeSum > 0 && stdDev > 0) {
          const scoreAdjustment =
            (grade.grade - avgGrades[grade.lesson_assessment_code]) / stdDev;
          grade.convertedGrade =
            ((scoreAdjustment * stdDev +
              avgGrades[grade.lesson_assessment_code]) /
              maxGradeSum) *
            grade.convert_grade;
        } else {
          grade.convertedGrade =
            (grade.grade / maxGradeSum) * grade.convert_grade;
        }
        if (isNaN(grade.convertedGrade)) {
          grade.convertedGrade = 0; // Handle NaN by setting to zero or another default value
        }
        student.grade_sums_by_assessment[
          grade.lesson_assessment_code
        ].converted_sum += grade.convertedGrade;
      });
    });

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
      // grades: newStudent.grades.map(({ grade_id, convertedGrade }) => ({
      //   grade_id,
      //   grade: convertedGrade.toFixed(2), // Format the converted grade
      // })),
      grade_sums_by_assessment: Object.entries(
        newStudent.grade_sums_by_assessment
      ).map(([key, sums]) => ({
        lesson_assessment_code: key,
        original_sum: sums.original_sum.toFixed(2),
        converted_sum: sums.converted_sum.toFixed(2),
      })),
    }));

    res.json({
      // table_header: headerData[0]?.grades,
      table_data: tableData,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getGradesController,
  updateGradeController,
  getDirectConvertedGradesController,
  getSDConvertedGradesController,
};
