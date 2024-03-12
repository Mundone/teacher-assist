const allModels = require("../models");

const getAllUserRoles = async ({ where, limit, offset, order, isWithoutBody }) => {

  if (isWithoutBody) {
    return await allModels.UserRole.findAll({
      attributes: ["id", "role_name", "createdAt"],
    });
  }

  let { count: totalUserRoles, rows: userRoles } =
    await allModels.UserRole.findAndCountAll({
      attributes: ["id", "role_name", "createdAt"],

      where: where,
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

  return {
    totalUserRoles,
    userRoles,
  };
};

const getUserRoleById = async (id) => {
  return await allModels.UserRole.findByPk(id);
};

const createUserRole = async (data) => {
  return await allModels.UserRole.create(data);
};

const updateUserRole = async (id, data) => {
  const currentModel = await allModels.UserRole.findByPk(id);
  if (currentModel) {
    return await currentModel.update(data);
  }
  return null;
};

const deleteUserRole = async (id) => {
  const currentModel = await allModels.UserRole.findByPk(id);
  if (currentModel) {
    await currentModel.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllUserRoles,
  getUserRoleById,
  createUserRole,
  updateUserRole,
  deleteUserRole,
};
