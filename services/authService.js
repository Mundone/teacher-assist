const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const allModels = require("../models");

const transporter = require("../config/email.config");
const fs = require("fs");
const path = require("path");

const registerUserService = async ({ code, name, password, roleID }) => {
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

const authenticateUserService = async (code, password) => {
  const inputUser = await allModels.User.findOne({
    where: { code },
    include: [
      {
        model: allModels.UserRole,
        attributes: ["id", "role_name"],
      },
    ],
  });
  const isMatch = await bcrypt.compare(password, inputUser?.password);
  if (!inputUser || !isMatch) {
    const error = new Error("Нууц үг буруу байна.");
    error.statusCode = 403;
    throw error;
  }

  const token = jwt.sign(
    {
      id: inputUser?.id,
      code: inputUser?.code,
      role_id: inputUser?.role_id,
      school_id: inputUser?.school_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "365d" }
  );

  var user = {
    id: inputUser?.id,
    name: inputUser?.name,
    email: inputUser?.email,
    code: inputUser?.code,
    role_id: inputUser?.role_id,
    user_role: inputUser?.user_role,
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

const getHtmlContent = (fileName, replacements = {}) => {
  const filePath = path.join(__dirname, "../public", fileName);
  let htmlContent = fs.readFileSync(filePath, "utf8");

  Object.keys(replacements).forEach((key) => {
    htmlContent = htmlContent.replace(
      new RegExp(`{{${key}}}`, "g"),
      replacements[key]
    );
  });

  return htmlContent;
};

const mailOptionsStudent = (to, password, loginUrl) => {
  const htmlContent = getHtmlContent("mailBodyStudent.html", {
    password,
    action_url: loginUrl,
  });

  return {
    from: {
      name: "Teacher Assistant Bot",
      address: process.env.EMAIL_USER,
    },
    to: [to],
    subject: "OTP for student",
    html: htmlContent,
  };
};

function generateCode(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

const sendEmailStudentService = async (email, student_code) => {
  // console.log()
  const ACTION_URL = "https://teachas.online";
  let isNewStudent = false;

  let inputStudent = await allModels.Student.findOne({
    where: { student_code: student_code?.toUpperCase() },
  });

  // If student does not exist, create one and mark as new
  if (!inputStudent) {
    inputStudent = await allModels.Student.create({
      email: email?.toUpperCase(),
      student_code: student_code?.toUpperCase(),
    });
    isNewStudent = true;
  } else {
    inputStudent.update({
      email: email,
    });
  }

  const password = generateCode(6);
  const options = mailOptionsStudent(email, password, ACTION_URL);

  try {
    // Attempt to send the email
    await transporter.sendMail(options);
    // If successful, hash and update the password
    const hashedPassword = await bcrypt.hash(password, 10);
    await allModels.Student.update(
      { password: hashedPassword },
      { where: { id: inputStudent.id } }
    );
  } catch (error) {
    // If email sending fails, delete the student if they were newly created
    if (isNewStudent) {
      await allModels.Student.destroy({ where: { id: inputStudent.id } });
    }
    // Rethrow the error to be handled by the caller
    throw new Error(
      "Failed to send email to student, the transaction has been reverted."
    );
  }
};

const authenticateStudentService = async (email, password) => {
  const inputStudent = await allModels.Student.findOne({
    where: { email: email?.toUpperCase() },
  });
  const isMatch = await bcrypt.compare(password, inputStudent?.password);
  if (!inputStudent || !isMatch) {
    const error = new Error("Имейл рүү явсан код буруу байна.");
    error.statusCode = 403;
    throw error;
  }

  const token = jwt.sign(
    {
      id: inputStudent?.id,
      name: inputStudent?.name,
      code: inputStudent?.student_code,
      email: inputStudent?.email?.toUpperCase(),
    },
    process.env.JWT_SECRET,
    { expiresIn: "365d" }
  );

  var user = {
    id: inputStudent?.id,
    name: inputStudent?.name,
    student_code: inputStudent?.student_code,
    email: inputStudent?.email?.toUpperCase(),
  };

  return { user, token };
};

// Service
const refreshTokenService = async (userId) => {
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

// Service
const refreshTokenStudentService = async (userId) => {
  const user = await allModels.Student.findByPk(userId, {
    // include: [
    //   {
    //     model: allModels.UserRole,
    //     attributes: ["id", "role_name"],
    //   },
    // ],
    attributes: ["id", "name", "student_code", "email", "createdAt"],
  });
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }
  return { user };
};

module.exports = {
  registerUserService,
  authenticateUserService,
  refreshTokenService,
  authenticateStudentService,
  refreshTokenStudentService,
  sendEmailStudentService,
};
