const labService = require('../services/labService');

exports.getLabs = async (req, res, next) => {
  try {
    const labs = await labService.getAllLabs();
    res.json(labs);
  } catch (error) {
    next(error);
  }
};
