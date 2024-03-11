const allModels = require("../models");

const getAllUserRoles = async ({ where, limit, offset, order }) => {

  let { count: totalUserRoles, rows: userRoles } =
    await allModels.UserRole.findAndCountAll({

      attributes: [
        "id",
        "role_name",
        "createdAt",
      ],

      where: where, // Use the where options built from filters
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

module.exports = {
  getAllUserRoles,
};
