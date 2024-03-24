const userRoleService = require("../services/userRoleService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

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
    responses.internalServerError;
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
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const getUserRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = await userRoleService.getUserRoleById(id);
    if (!userRole) {
      responses.notFound(res);
    }
    res.json(userRole);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const createUserRole = async (req, res, next) => {
  try {
    const newObject = await userRoleService.createUserRole(
      req.body
    );
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

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userRoleService.updateUserRole(id, req.body);
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

const deleteUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userRoleService.deleteUserRole(id);
    responses.deleted(res, {id: id});
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
  getUserRoles,
  getUserRolesWithoutBody,
  getUserRoleById,
  createUserRole,
  updateUserRole,
  deleteUserRole,
};
