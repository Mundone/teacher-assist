// controllers/studentController.js
const studentService = require("../services/studentService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getStudents = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;

    const subjectScheduleId = req.body.subject_schedule_id ?? null;

    if (subjectScheduleId == null) {
      return res
        .status(400)
        .json({ error: "subject_schedule_id -аа явуулаарай body-оороо." });
    }

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      userId: userId,
      subjectScheduleId: subjectScheduleId,
    };

    // console.log(req);

    const { totalStudents, students } = await studentService.getAllStudents(
      queryOptions
    );

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalStudents / pageSize),
        per_page: pageSize,
        total_elements: totalStudents,
      },
      data: students,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    responses.internalServerError(res, error);
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
      responses.forbidden(res);
    }
    responses.internalServerError(res, error);
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
      responses.forbidden(res);
    }
    responses.internalServerError(res, error);
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
      responses.forbidden(res);
    }
    responses.internalServerError(res, error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStudent = await studentService.updateStudent(id, req.body);
    responses.updated(res, req.body);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    responses.internalServerError(res, error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await studentService.deleteStudent(id);
    responses.deleted(res, { id: id });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    responses.internalServerError(res, error);
  }
};

module.exports = {
  getStudents,
  // getStudentsWithoutBody,
  getStudentById,
  createStudent,
  createStudentBulkController,
  updateStudent,
  deleteStudent,
};
