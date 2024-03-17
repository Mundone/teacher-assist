const allModels = require("../models");

const getAllSubjects = async ({
  where,
  limit,
  offset,
  order,
  isWithoutBody,
}) => {
  if (isWithoutBody) {
    return await allModels.Subject.findAll({
      attributes: ["id", "subject_name", "createdAt"],
    });
  }

  let { count: totalSubjects, rows: subjects } =
    await allModels.Subject.findAndCountAll({
      include: [
        {
          model: allModels.SubjectLessonType,
          attributes: ["lesson_type_id"],
          include: [
            {
              model: allModels.LessonType,
              attributes: ["lesson_type_name"],
            },
          ],
        },
      ],
      attributes: ["id", "subject_name", "createdAt"],
      where: where,
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });

  return {
    totalSubjects,
    subjects,
  };
};

const getSubjectById = async (id, userId) => {
  await checkIfUserCorrect(id, userId);
  return await allModels.Subject.findByPk(id, {
    attributes: ["id", "subject_name", "createdAt"],
  });
};

const createSubject = async (data, user_id) => {
  return await allModels.Subject.create({ ...data, user_id });
};

const updateSubject = async (id, data, userId) => {
  await checkIfUserCorrect(id, userId);
  return await allModels.Subject.update(data, {
    where: { id: id },
  });
};

const deleteSubject = async (id, userId) => {
  await checkIfUserCorrect(id, userId);
  return await allModels.Subject.destroy({
    where: { id: id },
  });
};

async function checkIfUserCorrect(id, userId) {
  const isUserCorrect = await allModels.Subject.findOne({
    where: { id: id, user_id: userId },
  });

  if (!isUserCorrect) {
    throw new Error("Зөвшөөрөлгүй хандалт.", { statusCode: 403 });
  }
}

module.exports = {
  getAllSubjects,
  createSubject,
  updateSubject,
  getSubjectById,
  deleteSubject,
};
