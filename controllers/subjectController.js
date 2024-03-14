const subjectService = require("../services/subjectService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const { internalServerError } = require("../utils/responseUtil");

exports.getSubjects = async (req, res, next) => {
  try {
    req.pagination.filters.push({
      fieldName: "user_id",
      operation: "eq",
      value: userId,
    });

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    // console.log(req);

    const { totalSubjects, subjects } = await subjectService.getAllSubjects(
      queryOptions
    );

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalSubjects / pageSize),
        per_page: pageSize,
        total_elements: totalSubjects,
      },
      data: subjects,
    });
  } catch (error) {
    internalServerError(res, error);
  }
};

// Controller
exports.createSubject = async (req, res, next) => {
  try {
    // Assuming the authenticated user's ID is stored in req.user.id
    // You should adjust the following line according to how your authentication system works
    const userId = req.user && req.user.id; // Replace with your method of retrieving the user ID
    if (!userId) {
      return res
        .status(403)
        .json({ message: "User ID is required to create a subject." });
    }

    const newSubject = await subjectService.createSubject(req.body, userId);
    res.status(201).json(newSubject);
  } catch (error) {
    internalServerError(res, error);
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await subjectService.updateSubject(id, req.body);
    res.status(200).json({ message: "Subject updated successfully" });
  } catch (error) {
    internalServerError(res, error);
  }
};

exports.getSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await subjectService.getSubjectById(id);
    res.json(subject);
  } catch (error) {
    internalServerError(res, error);
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await subjectService.deleteSubject(id);
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    internalServerError(res, error);
  }
};
