const UserFileService = require('../services/userFileService');

exports.getUserFiles = async (req, res, next) => {
  try {
    const userFiles = await UserFileService.getAllUserFiles();
    res.json(userFiles);
  } catch (error) {
    next(error);
  }
};
