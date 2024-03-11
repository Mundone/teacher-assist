// controllers/studentController.js
const studentService = require('../services/studentService');
const buildWhereOptions = require("../utils/sequelizeUtil");

exports.getStudents = async (req, res, next) => {
  try {
    const userId = req.user && req.user.role_id;
    if (userId != 1 && userId != 2 && userId != 3 ) {
      return res.status(403).json({ message: 'Authentication is required.' });
    }

    const subjectScheduleId = req.body.subject_schedule_id ?? null;

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      userId: userId,
      subjectScheduleId: subjectScheduleId
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
    if(error.statusCode != 403){
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      return res.status(403).json({ message: 'Зөвшөөрөлгүй хандалт.' });
    }
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const newStudent = await studentService.createStudent(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await studentService.updateStudent(id, req.body);
    res.json({ message: "Student updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await studentService.deleteStudent(id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};
