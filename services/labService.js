const Lab = require('../models/lab');

const getAllLabs = async () => {
  return await Lab.findAll();
};

module.exports = {
  getAllLabs,
};
