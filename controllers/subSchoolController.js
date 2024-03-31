const subSchoolService = require("../services/subSchoolService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getSubSchoolsController = async (req, res, next) => {
  try {
    // const userId = req.user && req.user.id;
    // req.pagination.filters.push({
    //   fieldName: "user_id",
    //   operation: "eq",
    //   value: userId,
    // });

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    // console.log(req);

    const { totalSubSchools, subSchools } =
      await subSchoolService.getAllSubSchoolsService(queryOptions);

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalSubSchools / pageSize),
        per_page: pageSize,
        total_elements: totalSubSchools,
      },
      data: subSchools,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getSubSchoolsWithoutBodyController = async (req, res, next) => {
  try {
    // const userId = req.user && req.user.id;
    // const filters = [
    //   {
    //     fieldName: "user_id",
    //     operation: "eq",
    //     value: userId,
    //   },
    // ];

    const objects = await subSchoolService.getAllSubSchoolsService({
      where: buildWhereOptions(filters),
      isWithoutBody: true,
    });
    res.json(objects);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getSubSchoolController = async (req, res, next) => {
  try {
    // const userId = req.user && req.user.id;
    const { id } = req.params;
    const object = await subSchoolService.getSubjectByIdService(
      id
      //  userId
    );
    res.json(object);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const createSubSchoolController = async (req, res, next) => {
  try {
    // const userId = req.user && req.user.id;
    const newObject = await subSchoolService.createSubSchoolService(
      req.body
      // userId
    );
    responses.created(res, newObject);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const updateSubSchoolController = async (req, res, next) => {
  try {
    // const userId = req.user && req.user.id;
    const { id } = req.params;
    await subSchoolService.updateSubSchoolService(
      id,
      req.body
      //  userId
    );
    responses.updated(res, req.body);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const deleteSubSchoolController = async (req, res, next) => {
  try {
    // const userId = req.user && req.user.id;
    const { id } = req.params;
    await subSchoolService.deleteSubSchoolService(
      id
      //  userId
    );
    responses.deleted(res, { id: id });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getSubSchoolsController,
  getSubSchoolsWithoutBodyController,
  getSubSchoolController,
  createSubSchoolController,
  updateSubSchoolController,
  deleteSubSchoolController,
};
