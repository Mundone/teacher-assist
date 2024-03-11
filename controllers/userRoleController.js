const userRoleService = require("../services/userRoleService");
const buildWhereOptions = require("../utils/sequelizeUtil");

exports.getUserRoles = async (req, res, next) => {
  try {
    const userId = req.user && req.user.role_id;
    if (userId != 1 && userId != 2 && userId != 3) {
      return res.status(403).json({ message: "Зөвшөөрөлгүй хандалт." });
    }

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    // console.log(req);

    const { totalUserRoles, userRoles } = await userRoleService.getAllUserRoles(
      queryOptions
    );

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalUserRoles / pageSize),
        per_page: pageSize,
        total_elements: totalUserRoles,
      },
      data: userRoles,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};