const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getSurveysService = async ({ where }) => {
  return await allModels.Survey.findAll({
    // attributes: [],
    where: where,
    include: [
      {
        model: allModels.Question,
        // attributes: [],
        include: [
          {
            model: allModels.OfferedAnswer,
            // attributes: [],
          },
        ],
      },
    ],
  });
};

module.exports = {
  getSurveysService,
};
