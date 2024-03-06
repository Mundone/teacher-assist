const UserRoleService = require('../services/userRoleService');

exports.getUserRoles = async (req, res, next) => {
  try {
    const userRoles = await UserRoleService.getAllUserRoles();
    res.json(userRoles);
  } catch (error) {
    next(error);
  }
};
