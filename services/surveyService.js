const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getSurveysService = async ({ where }) => {
  return await allModels.Survey.findAll({
    attributes: ["id", "survey_title", "description"],
    where: where,
    order: [
      ["id", "ASC"],
      [allModels.Question, allModels.OfferedAnswer, "order_no", "DESC"],
    ],

    include: [
      {
        model: allModels.Question,
        attributes: ["order_no", "id", "question_text", "placeholder", "type"],
        include: [
          {
            model: allModels.OfferedAnswer,
            attributes: ["order_no", "id", "value"],
          },
        ],
      },
    ],
  });
};

module.exports = {
  getSurveysService,
};
