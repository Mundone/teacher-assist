// controllers/studentController.js
const studentService = require("../services/studentService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const { internalServerError } = require("../utils/responseUtil");

const getStudents = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;

    const subjectScheduleId = req.body.subject_schedule_id ?? null;

    if (subjectScheduleId == null) {
        return res.status(400).json({"error": "subject_schedule_id -аа явуулаарай body-оороо."});
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
    internalServerError(res, error);
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
//     internalServerError(res, error);
//   }
// };

const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    internalServerError(res, error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const newStudent = await studentService.createStudent(req.body);
    res
      .status(201)
      .json({ message: "Student created successfully", newStudent });
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStudent = await studentService.updateStudent(id, req.body);
    res.json({ message: "Student updated successfully", updatedStudent });
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await studentService.deleteStudent(id);
    res.json({ message: "Student deleted successfully", id });
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  getStudents,
  // getStudentsWithoutBody,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
