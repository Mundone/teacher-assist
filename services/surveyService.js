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

const createSurveyService = async (body, userId) => {
  const { survey_title, description, questions } = body;

  const transaction = await allModels.sequelize.transaction();

  try {
    const survey = await allModels.Survey.create(
      {
        survey_title,
        description,
        user_id: userId
      },
      { transaction }
    );

    for (const question of questions) {
      const { question_text, placeholder, type, offered_answers } = question;

      const createdQuestion = await allModels.Question.create(
        {
          survey_id: survey.id,
          question_text,
          placeholder,
          type,
        },
        { transaction }
      );

      if (offered_answers && offered_answers.length) {
        for (const answer of offered_answers) {
          await allModels.OfferedAnswer.create(
            {
              question_id: createdQuestion.id,
              value: answer.value,
            },
            { transaction }
          );
        }
      }
    }

    await transaction.commit();
    return survey;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const submitSurveyService = async (responses, studentId) => {
  const transaction = await allModels.sequelize.transaction();

  try {
    for (const response of responses) {
      const { question_id, answer_text, answer_id } = response;

      await allModels.Response.create(
        {
          student_id: studentId,
          question_id,
          answer_text,
          answer_id,
        },
        { transaction }
      );
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getSurveysService,
  createSurveyService,
  submitSurveyService,
};
