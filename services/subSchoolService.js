const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getAllSubSchoolsService = async ({
  where,
  limit,
  offset,
  order,
  isWithoutBody,
}) => {
  if (isWithoutBody) {
    return await allModels.SubSchool.findAll({
      // where: where,
    });
  }

  let { count: totalSubSchools, rows: subSchools } =
    await allModels.SubSchool.findAndCountAll({
      where: where,
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

  return {
    totalSubSchools,
    subSchools,
  };
};

const getSubjectById = async (
  id
  // userId
) => {
  // await checkIfUserCorrect(id, userId);
  return await allModels.SubSchool.findByPk(id, {
    // attributes: ["id", "subject_name", "subject_code", "createdAt"],
  });
};

const createSubSchoolService = async (
  data
  // user_id
) => {
  return await allModels.SubSchool.create(data);
};

const updateSubSchoolService = async (
  id,
  data
  // userId
) => {
  // await checkIfUserCorrect(id, userId);
  return await allModels.SubSchool.update(data, {
    where: { id: id },
  });
};

const deleteSubSchoolService = async (
  id
  // userId
) => {
  // await checkIfUserCorrect(id, userId);
  return await allModels.SubSchool.destroy({
    where: { id: id },
  });
};

// async function checkIfUserCorrect(id, userId) {
//   const isUserCorrect = await allModels.SubSchool.findOne({
//     where: { id: id, user_id: userId },
//   });

//   if (!isUserCorrect) {
//     const error = new Error("Зөвшөөрөлгүй хандалт.");
//     error.statusCode = 403;
//     throw error;
//   }
// }

module.exports = {
  getAllSubSchoolsService,
  createSubSchoolService,
  updateSubSchoolService,
  getSubjectById,
  deleteSubSchoolService,
};
