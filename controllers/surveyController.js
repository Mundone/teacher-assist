const surveyService = require("../services/surveyService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getSurveysController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const filters = [
      {
        fieldName: "user_id",
        operation: "eq",
        value: userId,
      },
    ];

    const objects = await surveyService.getSurveysService({
      where: buildWhereOptions(filters),
    });
    res.json(objects);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getSurveysController
};
