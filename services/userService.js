const allModels = require("../models");
const bcrypt = require("bcryptjs");

const getAllUsers = async ({ where, limit, offset, order, isWithoutBody }) => {
  if (isWithoutBody) {
    return await allModels.User.findAll({
      include: [
        {
          model: allModels.UserRole,
          attributes: ["id", "role_name"],
        },
      ],
      attributes: ["id", "name", "email", "code", "role_id", "createdAt"],
    });
  }
  let { count: totalObjects, rows: objects } =
    await allModels.User.findAndCountAll({
      include: [
        {
          model: allModels.UserRole,
          attributes: ["id", "role_name"],
        },
      ],
      attributes: ["id", "name", "email", "code", "role_id", "createdAt"],

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

const getUserById = async (id) => {
  return await allModels.User.findByPk(id, {
    include: [
      {
        model: allModels.UserRole,
        attributes: ["id", "role_name"],
      },
    ],
    attributes: ["id", "name", "email", "code", "role_id", "createdAt"],
  });
};

const createUser = async (data) => {
  const password = data.password;

  const hashedPassword = await bcrypt.hash(password, 10);

  return await allModels.User.create({
    code: data.code,
    email: data.email,
    name: data.name,
    password: hashedPassword,
    role_id: data.role_id,
  });
};

const updateUser = async (id, data) => {
  const user = await allModels.User.findByPk(id);
  if (user) {
    return await user.update(data);
  }
  return null;
};

const deleteUser = async (id) => {
  const user = await allModels.User.findByPk(id);
  if (user) {
    await user.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
