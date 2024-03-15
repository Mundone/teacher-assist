const allModels = require("../models");

const getAllUserFilesService = async ({ where, limit, offset, order }) => {
  let { count: totalObjects, rows: objects } =
    await allModels.UserFile.findAndCountAll({
      attributes: ["id", "file_name", "file_path", "file_type", "createdAt"],

      where: where,
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

  return {
    totalObjects,
    objects,
  };
};

const getUserFileByIdService = async (id, userId) => {
  await checkIfUserCorrect(id, userId);
  return await allModels.UserFile.findByPk(id, {
    attributes: ["id", "file_name", "file_path", "file_type", "createdAt"],
  });
};

const createUserFileService = async (data, user_id) => {
  return await allModels.UserFile.create({ ...data, user_id });
};

const updateUserFileService = async (id, data, userId) => {
  await checkIfUserCorrect(id, userId);
  const user = await allModels.UserFile.findByPk(id);
  if (user) {
    return await user.update(data);
  }
  return null;
};

const deleteUserFileService = async (id, userId) => {
  await checkIfUserCorrect(id, userId);
  const user = await allModels.UserFile.findByPk(id);
  if (user) {
    await user.destroy();
    return true;
  }
  return false;
};

async function checkIfUserCorrect(id, userId) {
  const isUserCorrect = await allModels.UserFile.findOne({
    where: { id: id, user_id: userId },
  });

  if (!isUserCorrect) {
    throw new Error("Зөвшөөрөлгүй хандалт.", { statusCode: 403 });
  }
}

module.exports = {
  getAllUserFilesService,
  getUserFileByIdService,
  createUserFileService,
  updateUserFileService,
  deleteUserFileService,
};
