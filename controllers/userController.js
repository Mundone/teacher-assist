// controllers/teacherController.js
const userService = require("../services/userService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getUsers = async (req, res, next) => {
  try {
    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    const { totalObjects, objects } = await userService.getAllUsers(
      queryOptions
    );

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
      responses.forbidden(res, error);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};


const getUsersWithoutBody = async (req, res, next) => {
  try {
    const users =
      await userService.getAllUsers({
        isWithoutBody: true,
      });
    res.json(users);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      responses.notFound(res);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const newObject = await userService.createUser(req.body);
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

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.updateUser(id, req.body);
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

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
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


module.exports = {
  getUsers,
  getUsersWithoutBody,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
