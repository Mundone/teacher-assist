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
    semester
  };
};

module.exports = {
  getCurrentWeekService,
};
