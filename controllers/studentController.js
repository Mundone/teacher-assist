// controllers/studentController.js
const studentService = require("../services/studentService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getStudents = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;

    const { subject_id } = req.params;

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      userId: userId,
      subjectId: subject_id,
    };

    // console.log(req);

    const { totalStudents, students } = await studentService.getAllStudents(
      queryOptions
    );

    // var newStudents = students.map((student) => {

    //   return {
    //     id: student.id,
    //     name: student.name,
    //     student_code: student.student_code,
    //     createdAt: student.createdAt,

    //     subject_schedule_id:
    //       student?.student_subject_schedules?.subject_schedule?.id,
    //     subject_schedule_name:
    //       student?.student_subject_schedules?.subject_schedule?.lecture_day +
    //       student?.student_subject_schedules?.subject_schedule?.lecture_time,
    //   };
    // });
    
    
    // const student = await subjectService.get(subject_id);

    var newStudents = students.map((student) => {
      // Assuming there's only one student_subject_schedule per student,
      // or you want to take the first one.
      const subjectSchedule =
        student.student_subject_schedules[0]?.subject_schedule;

      return {
        id: student.id,
        name: student.name,
        student_code: student.student_code,
        createdAt: student.createdAt,
        subject_schedule_id: subjectSchedule?.id,
        schedule_id: subjectSchedule?.schedule.id,
        schedule_name: subjectSchedule?.schedule.schedule_name,
        // Assuming you want to combine lecture_day and lecture_time for the name
        // Ensure that both properties exist in your data structure
        // subject_schedule_name:
        // numberToDay(subjectSchedule?.lecture_day) + " - " + subjectSchedule?.lecture_time,
      };
    });

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalStudents / pageSize),
        per_page: pageSize,
        total_elements: totalStudents,
        subject_name: totalStudents,
        subject_code: totalStudents,
      },
      data: newStudents,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

// const getStudentsWithoutBody = async (req, res, next) => {
//   try {
//     const userId = req.user && req.user.id;
//     const subjectScheduleId = req.body.subject_schedule_id ?? null;
//     const students = await studentService.getAllStudents({
//       userId: userId,
//       isWithoutBody: true,
//       subjectScheduleId: subjectScheduleId,
//     });
//     res.json(students);
//   } catch (error) {
//     responses.internalServerError(res, error);
//   }
// };

const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);
    if (!student) {
      // return res.status(404).json({ message: "Student not found" });
      responses.notFound(res);
    }
    res.json(student);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const createStudent = async (req, res, next) => {
  try {
    const subjectScheduleId = req.body.subject_schedule_id ?? null;

    if (subjectScheduleId == null) {
      return res
        .status(400)
        .json({ error: "subject_schedule_id -аа явуулаарай body-оороо." });
    }

    const newObject = await studentService.createStudent(
      req.body,
      subjectScheduleId
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

const createStudentBulkController = async (req, res, next) => {
  try {
    const subjectScheduleId = req.body.subject_schedule_id ?? null;

    if (subjectScheduleId == null) {
      return res
        .status(400)
        .json({ error: "subject_schedule_id -аа явуулаарай body-оороо." });
    }
    const newObject = await studentService.createStudentBulkService(
      req.body.students,
      subjectScheduleId
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

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStudent = await studentService.updateStudent(id, req.body);
    responses.updated(res, req.body);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await studentService.deleteStudent(id);
    responses.deleted(res, { id: id });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

function numberToDay(number) {
  const dayMap = {
      1: 'Даваа',
      2: 'Мягмар',
      3: 'Лхагва',
      4: 'Пүрэв',
      5: 'Пүрэв',
      6: 'Бямба',
      7: 'Ням'
  };

  return dayMap[number] || 'Invalid day';
}

module.exports = {
  getStudents,
  // getStudentsWithoutBody,
  getStudentById,
  createStudent,
  createStudentBulkController,
  updateStudent,
  deleteStudent,
};
