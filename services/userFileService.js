const UserFile = require('../models/userFile');

const getAllUserFiles = async () => {
  return await UserFile.findAll();
};

module.exports = {
  getAllUserFiles,
};
