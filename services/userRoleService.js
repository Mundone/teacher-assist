const UserRole = require('../models/userRole');

const getAllUserRoles = async () => {
  return await UserRole.findAll();
};

module.exports = {
  getAllUserRoles,
};
