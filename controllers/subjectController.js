const subjectService = require("../services/subjectService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getSubjects = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
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
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const getSubjectWithoutBody = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const filters = [
      {
        fieldName: "user_id",
        operation: "eq",
        value: userId,
      },
    ];

    const objects = await subjectService.getAllSubjects({
      where: buildWhereOptions(filters),
      isWithoutBody: true,
    });
    res.json(objects);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const getSubject = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    const subject = await subjectService.getSubjectById(id, userId);
    res.json(subject);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const createSubject = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const newObject = await subjectService.createSubject(req.body, userId);
    responses.created(res, newObject);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    await subjectService.updateSubject(id, req.body, userId);
    responses.updated(res, req.body);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    await subjectService.deleteSubject(id, userId);
    responses.deleted(res, { id: id });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getSubjects,
  getSubjectWithoutBody,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
};
