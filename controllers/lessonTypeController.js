const lessonTypeService = require("../services/lessonTypeService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getLessonTypes = async (req, res, next) => {
  try {
    const userId = req.user && req.user.role_id;
    if (userId != 1 && userId != 2 && userId != 3) {
      responses.forbidden(res);
    }

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    const { totalLessonTypes, lessonTypes } =
      await lessonTypeService.getAllLessonTypes(queryOptions);

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalLessonTypes / pageSize),
        per_page: pageSize,
        total_elements: totalLessonTypes,
      },
      data: lessonTypes,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const getLessonTypesWithoutBody = async (req, res, next) => {
  try {
    const lessonTypes =
      await lessonTypeService.getAllLessonTypes({
        isWithoutBody: true,
      });
    res.json(lessonTypes);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const getLessonTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lessonType = await lessonTypeService.getLessonTypeById(id);
    if (!lessonType) {
      // return res.status(404).json({ message: "LessonType not found" });
      responses.notFound(res);
    }
    res.json(lessonType);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const createLessonType = async (req, res, next) => {
  try {
    const newObject = await lessonTypeService.createLessonType(req.body);
    responses.created(res, newObject);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const updateLessonType = async (req, res, next) => {
  try {
    const { id } = req.params;
    await lessonTypeService.updateLessonType(
      id,
      req.body
    );
    responses.updated(res, req.body);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const deleteLessonType = async (req, res, next) => {
  try {
    const { id } = req.params;
    await lessonTypeService.deleteLessonType(id);
    responses.deleted(res, {id: id});
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getLessonTypes,
  getLessonTypesWithoutBody,
  getLessonTypeById,
  createLessonType,
  updateLessonType,
  deleteLessonType,
};
