const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const allModels = require("../models");

const registerUser = async ({ code, name, password, roleID }) => {
  const existingUser = await allModels.User.findOne({ where: { code } });
  if (existingUser) {
    throw new Error("Хэрэглэгчийн код давтагдаж байна.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    code: code,
    name: name,
    password: hashedPassword,
    role_id: roleID,
  });

  return newUser;
};

const authenticateUser = async (code, password) => {
  const inputUser = await allModels.User.findOne({
    where: { code },
    include: [
      {
        model: allModels.UserRole,
        attributes: ["id", "role_name"],
      },
    ],
  });
  const isMatch = await bcrypt.compare(password, inputUser.password);
  if (!inputUser || !isMatch) {
    const error = new Error("Нууц үг буруу байна.");
    error.statusCode = 403;
    throw error;
  }

  const token = jwt.sign(
    { id: inputUser.id, code: inputUser.code, role_id: inputUser.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "72h" }
  );

  var user = {
    id: inputUser.id,
    name: inputUser.name,
    email: inputUser.email,
    code: inputUser.code,
    role_id: inputUser.role_id,
    user_role: inputUser.user_role,
  };

  const userMenus = await allModels.Menu.findAll({
    include: [
      {
        model: allModels.UserRoleMenu,
        where: { user_role_id: user.role_id },
        include: [
          {
            model: allModels.UserRole,
            where: { id: user.role_id },
            attributes: [],
          },
        ],
        attributes: [],
      },
    ],
    order: [
      ["parent_id", "ASC"],
      ["sorted_order", "ASC"],
    ],
  });

  const menusJson = userMenus.map((menu) => menu.toJSON());

  let menuMap = {};
  menusJson.forEach((menu) => {
    if (menu.parent_id === 0) {
      menu.ChildMenu = [];
    }
    menuMap[menu.id] = menu;

    if (menu.parent_id !== 0) {
      if (menuMap[menu.parent_id]) {
        menuMap[menu.parent_id].ChildMenu.push(menu);
        delete menu.ChildMenu;
      } else {
        menuMap[menu.parent_id] = { ChildMenu: [menu] };
      }
    }
  });

  let topLevelMenus = Object.values(menuMap).filter(
    (menu) => menu.parent_id === 0
  );

  return { user, token, UserMenus: topLevelMenus };
};

// Service
const refreshToken = async (userId) => {
  const user = await allModels.User.findByPk(userId, {
    include: [
      {
        model: allModels.UserRole,
        attributes: ["id", "role_name"],
      },
    ],
    attributes: ["id", "name", "email", ["code", "teacher_code"], "role_id"],
  });
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const userMenus = await allModels.Menu.findAll({
    include: [
      {
        model: allModels.UserRoleMenu,
        where: { user_role_id: user.role_id },
        include: [
          {
            model: allModels.UserRole,
            where: { id: user.role_id },
            attributes: [],
          },
        ],
        attributes: [],
      },
    ],
    order: [
      ["parent_id", "ASC"],
      ["sorted_order", "ASC"],
    ],
  });

  const menusJson = userMenus.map((menu) => menu.toJSON());

  let menuMap = {};
  menusJson.forEach((menu) => {
    if (menu.parent_id === 0) {
      menu.ChildMenu = [];
    }
    menuMap[menu.id] = menu;

    if (menu.parent_id !== 0) {
      if (menuMap[menu.parent_id]) {
        menuMap[menu.parent_id].ChildMenu.push(menu);
        delete menu.ChildMenu;
      } else {
        menuMap[menu.parent_id] = { ChildMenu: [menu] };
      }
    }
  });

  let topLevelMenus = Object.values(menuMap).filter(
    (menu) => menu.parent_id === 0
  );

  return { user, UserMenus: topLevelMenus };
};

module.exports = {
  registerUser,
  authenticateUser,
  refreshToken,
};
