const userRoleService = require("../services/userRoleService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const { internalServerError } = require("../utils/responseUtil");

const getUserRoles = async (req, res, next) => {
  try {
    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;
    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };
    const { totalUserRoles, userRoles } = await userRoleService.getAllUserRoles(
      queryOptions
    );

    res.json({
      pagination: {
        current_page_no: pageNo + 1,
        total_pages: Math.ceil(totalUserRoles / pageSize),
        per_page: pageSize,
        total_elements: totalUserRoles,
      },
      data: userRoles,
    });
  } catch (error) {
    internalServerError;
  }
};

const getUserRolesWithoutBody = async (req, res, next) => {
  try {

    const userRoles =
      await userRoleService.getAllUserRoles({
        isWithoutBody: true,
      });
    res.json(userRoles);
  } catch (error) {
    internalServerError(res, error);
  }
};

const getUserRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await userRoleService.getUserRoleById(id);
    if (!student) {
      return res.status(404).json({ message: "UserRole not found" });
    }
    res.json(student);
  } catch (error) {
    internalServerError(res, error);
  }
};

const createUserRole = async (req, res, next) => {
  try {
    const newUserRole = await userRoleService.createUserRole(
      req.body
    );
    res.status(201).json({ message: "UserRole created successfully", newUserRole });
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userRoleService.updateUserRole(id, req.body);
    res.json({ message: "UserRole updated successfully", data: req.body });
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userRoleService.deleteUserRole(id);
    res.json({ message: "UserRole deleted successfully", id });
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  getUserRoles,
  getUserRolesWithoutBody,
  getUserRoleById,
  createUserRole,
  updateUserRole,
  deleteUserRole,
};
