const settingsService = require("../services/settingsService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getCurrentWeekController = async (req, res, next) => {
  try {
    const objectData = await settingsService.getCurrentWeekService();
    res.json(objectData);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const getSemestersController = async (req, res, next) => {
  try {

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    const { totalObjects, objects } =
      await settingsService.getAllSemestersService(queryOptions);

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalObjects / pageSize),
        per_page: pageSize,
        total_elements: totalObjects,
      },
      data: objects,
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

const getSemesterController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const semester = await settingsService.getSemesterByIdService(id);
    if (!semester) {
      responses.notFound(res);
    }
    res.json(semester);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const createSemesterController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const newObject = await settingsService.createSemesterService(
      req.body,
      userId
    );
    responses.created(res, newObject);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const updateSemesterController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await settingsService.updateSemesterService(id, req.body);
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

const deleteSemesterController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await settingsService.deleteSemesterService(id);
    responses.deleted(res, {id: id});
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};


const changeQRUrlController = async (req, res, next) => {
  try {
    await settingsService.changeQRUrlService(req.body.host);
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
  getCurrentWeekController,
  getSemestersController,
  getSemesterController,
  createSemesterController,
  updateSemesterController,
  deleteSemesterController,
  changeQRUrlController
};
