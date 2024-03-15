const allModels = require("../models");

const getCurrentWeekService = async () => {
  const exist = await allModels.Semester.findOne();

  if (!exist) {
    throw new Error("Семистер үүсгээгүй байна.", { statusCode: 404 });
  }

  var weekCount = 0;

  const activeSemester = await allModels.Semester.findOne({
    where: {
      is_active: true,
    },
  });

  if (!activeSemester) {
    throw new Error("Семистер эхлээгүй байна.", { statusCode: 400 });
  } else {
    await allModels.Semester.findOne({
      where: {
        is_active: true,
      },
    }).then((obj) => {
      // const dateString = "2024-01-24T00:00:00.000Z";
      const dateString = obj.start_date.toString();
      const targetDate = new Date(dateString);
      const currentDate = new Date();
      const diffInMilliseconds = targetDate - currentDate;
      const diffInWeeks = diffInMilliseconds / (1000 * 60 * 60 * 24 * 7);
      weekCount = Math.abs(Math.round(diffInWeeks));
    });
  }

  const semesters = await allModels.Semester.findAll({
    attributes: ["id", "semester_code"],
  });
  var semester = semesters[0].toJSON();
  semester.weekNumber = weekCount + 1;

  return {
    semester,
  };
};

const getAllSemestersService = async ({ where, limit, offset, order }) => {
  let { count: totalObjects, rows: objects } =
    await allModels.Semester.findAndCountAll({
      attributes: [
        "id",
        "semester_code",
        "start_date",
        "is_active",
        // "user_id",
        "createdAt",
      ],
      include: {
        model: allModels.User,
        attributes: ["id", "name", "email", "code"],
      },

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

const getSemesterByIdService = async (id) => {
  return await allModels.Semester.findByPk(id);
};

const createSemesterService = async (objectData, user_id) => {
  return await allModels.Semester.create({ ...objectData, user_id });
};

const updateSemesterService = async (id, objectData) => {
  return await allModels.Semester.update(objectData, {
    where: { id: id },
  });
};

const deleteSemesterService = async (id) => {
  return await allModels.Semester.destroy({
    where: { id: id },
  });
};

module.exports = {
  getCurrentWeekService,
  getAllSemestersService,
  getSemesterByIdService,
  createSemesterService,
  updateSemesterService,
  deleteSemesterService,
};
