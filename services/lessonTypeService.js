const allModels = require("../models");

const getAllLessonTypes = async ({
  where,
  limit,
  offset,
  order,
  isWithoutBody,
}) => {
  if (isWithoutBody) {
    return await allModels.LessonType.findAll({
      attributes: [
        "id",
        "lesson_type_name",
        "lesson_type_code_for_excel",
        "createdAt",
      ],
    });
  }

  console.log(where);

  let { count: totalLessonTypes, rows: lessonTypes } =
    await allModels.LessonType.findAndCountAll({
      attributes: [
        "id",
        "lesson_type_name",
        "lesson_type_code_for_excel",
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

const getLessonTypeById = async (id) => {
  return await allModels.LessonType.findByPk(id);
};

const getLessonTypeByCode = async (lessonTypeCode) => {
  return await allModels.LessonType.findOne({
    where: { lesson_type_code_for_excel: lessonTypeCode },
  });
};

const createLessonType = async (lessonTypeData) => {
  return await allModels.LessonType.create(lessonTypeData);
};

const updateLessonType = async (id, lessonTypeData) => {
  return await allModels.LessonType.update(lessonTypeData, {
    where: { id: id },
  });
};

const deleteLessonType = async (id) => {
  return await allModels.LessonType.destroy({
    where: { id: id },
  });
};

module.exports = {
  getAllLessonTypes,
  getLessonTypeById,
  createLessonType,
  updateLessonType,
  deleteLessonType,
  getLessonTypeByCode,
};
