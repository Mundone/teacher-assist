// controllers/teacherController.js
const userService = require("../services/userService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const { internalServerError } = require("../utils/responseUtil");

const getUsers = async (req, res, next) => {
  try {
    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    // console.log(req);

    const { totalObjects, objects } = await userService.getAllUsers(
      queryOptions
    );

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
    internalServerError(res, error);
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
    internalServerError(res, error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.updateUser(id, req.body);
    res.json({ message: "User updated successfully", data: {...req.body, id: (Number(id))}});
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    internalServerError(res, error);
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
