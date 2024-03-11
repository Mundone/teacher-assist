const { Sequelize } = require("sequelize");

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

module.exports = buildWhereOptions;
