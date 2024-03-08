const subjectService = require("../services/subjectService");
const { Sequelize } = require("sequelize");

exports.getSubjects = async (req, res, next) => {
  try {
    // Retrieve the user ID from the authentication middleware (e.g., Passport.js)
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(403).json({ message: 'Authentication is required.' });
    }

    // Include the user ID in the pagination filters
    req.pagination.filters.push({
      fieldName: 'user_id',
      operation: 'eq',
      value: userId,
    });

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    // console.log(req);

    const { totalSubjects, subjects } = await subjectService.getAllSubjects(
      queryOptions
    );

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalSubjects / pageSize),
        per_page: pageSize,
        total_elements: totalSubjects,
      },
      data: subjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller
exports.createSubject = async (req, res, next) => {
  try {
    // Assuming the authenticated user's ID is stored in req.user.id
    // You should adjust the following line according to how your authentication system works
    const userId = req.user && req.user.id; // Replace with your method of retrieving the user ID
    if (!userId) {
      return res.status(403).json({ message: 'User ID is required to create a subject.' });
    }

    const newSubject = await subjectService.createSubject(req.body, userId);
    res.status(201).json(newSubject);
  } catch (error) {
    next(error);
  }
};


exports.updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await subjectService.updateSubject(id, req.body);
    res.status(200).json({ message: "Subject updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await subjectService.getSubjectById(id);
    res.json(subject);
  } catch (error) {
    next(error);
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await subjectService.deleteSubject(id);
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// A utility function that builds a Sequelize where clause from a filter array
function buildWhereOptions(filters) {
  return filters.reduce((acc, filter) => {
    if (filter.value !== "") {
      // Only add to the where clause if the value is not empty
      const fieldName = filter.fieldName; // Assuming filter structure has field_name
      const sequelizeOperator = getSequelizeOperator(filter.operation);
      // Use the '%' wildcard for partial matching if using 'like'
      if(filter.operation == 'like'){
        acc[fieldName] = { [sequelizeOperator]: `%${filter.value}%` };
      } else {
        acc[fieldName] = { [sequelizeOperator]: `${filter.value}` };
      }
    }
    return acc;
  }, {});
}

function getSequelizeOperator(operation) {
  const operators = {
    like: Sequelize.Op.like, // SQL LIKE operator (case-sensitive)
    notLike: Sequelize.Op.notLike, // SQL NOT LIKE operator (case-sensitive)
    eq: Sequelize.Op.eq, // SQL = operator
    ne: Sequelize.Op.ne, // SQL != operator
    gte: Sequelize.Op.gte, // SQL >= operator
    gt: Sequelize.Op.gt, // SQL > operator
    lte: Sequelize.Op.lte, // SQL <= operator
    lt: Sequelize.Op.lt, // SQL < operator
    in: Sequelize.Op.in, // SQL IN operator
    notIn: Sequelize.Op.notIn, // SQL NOT IN operator
    is: Sequelize.Op.is, // SQL IS operator
    not: Sequelize.Op.not, // SQL IS NOT operator
    between: Sequelize.Op.between, // SQL BETWEEN operator
    notBetween: Sequelize.Op.notBetween, // SQL NOT BETWEEN operator
    // ... more operators as needed
  };
  return operators[operation] || Sequelize.Op.eq; // Default to eq if operation is not recognized
}
