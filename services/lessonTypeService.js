const allModels = require("../models");


const getAllLessonTypes = async ({ where, limit, offset, order }) => {

  console.log(where);

  let { count: totalLessonTypes, rows: lessonTypes } =
    await allModels.LessonType.findAndCountAll({
      attributes: [
        "id",
        "lesson_type_name",
        "createdAt",
      ],

      where: where, // Use the where options built from filters
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

  return {
    totalLessonTypes,
    lessonTypes,
  };
};

module.exports = {
  getAllLessonTypes,
};
