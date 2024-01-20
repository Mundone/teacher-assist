const Student = require('../models/student');
const { Op } = require('sequelize');

const getAllStudents = async (queryParameters = {}) => {
  const where = {};
  const order = [];

  // Example of handling various query parameters
  if (queryParameters.name) {
    where.name = queryParameters.name; // Equality
  }

  if (queryParameters.ageGreaterThan) {
    where.age = { [Op.gt]: queryParameters.ageGreaterThan }; // Greater than
  }

  if (queryParameters.emailIncludes) {
    where.email = { [Op.like]: `%${queryParameters.emailIncludes}%` }; // Like / Includes
  }

  // Handling sorting (e.g., 'age DESC')
  if (queryParameters.sort) {
    const [field, orderType] = queryParameters.sort.split(' ');
    order.push([field, orderType.toUpperCase()]);
  }

  return await Student.findAll({ where, order });
};

module.exports = {
  getAllStudents,
};
