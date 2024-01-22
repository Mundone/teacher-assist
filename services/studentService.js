const { Op } = require('sequelize');

const queryBuilder = (queryParams) => {
  const where = {};
  const order = [];

  // Define a mapping of query param keys to their Sequelize operators
  const queryMap = {
    name: { operator: Op.eq, field: 'name' },
    ageGreaterThan: { operator: Op.gt, field: 'age' },
    emailIncludes: { operator: Op.like, field: 'email', process: (value) => `%${value}%` },
    sort: { process: (value) => value.split(' ') }
  };

  Object.keys(queryParams).forEach(key => {
    if (key in queryMap) {
      const { operator, field, process } = queryMap[key];

      if (key === 'sort') {
        const [sortField, sortOrder] = process(queryParams[key]);
        order.push([sortField, sortOrder.toUpperCase()]);
      } else {
        const value = process ? process(queryParams[key]) : queryParams[key];
        where[field] = operator ? { [operator]: value } : value;
      }
    }
  });

  return { where, order };
};
