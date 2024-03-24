const userFileService = require("../services/userFileService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getUserFilesController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    req.pagination.filters.push({
      fieldName: "user_id",
      operation: "eq",
      value: userId,
    });
    console.log(req.pagination)
    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    const { totalObjects, objects } =
      await userFileService.getAllUserFilesService(queryOptions);

      console.log(totalObjects)
      console.log(objects)

    res.json({
      pagination: {
        current_page_no: pageNo + 1,
        total_pages: Math.ceil(totalObjects / pageSize),
        per_page: pageSize,
        total_elements: totalObjects,
      },
      data: objects,
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

const getUserFileController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    const user = await userFileService.getUserFileByIdService(id, userId);
    if (!user) {
      responses.notFound(res);
    }
    res.json(user);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const createUserFileController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const newObject = await userFileService.createUserFileService(req.body, userId);
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

const updateUserFileController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    await userFileService.updateUserFileService(id, req.body, userId);
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

const deleteUserFileController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    await userFileService.deleteUserFileService(id, userId);
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
  getUserFilesController,
  getUserFileController,
  createUserFileController,
  updateUserFileController,
  deleteUserFileController,
};
