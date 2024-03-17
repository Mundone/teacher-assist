const subjectScheduleService = require("../services/subjectScheduleService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

exports.getSubjectSchedules = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    // const roleId = req.user && req.user.role_id;
    // if (roleId != 1 && roleId != 2 && roleId != 3) {
    //   return res.status(403).json({ message: "Зөвшөөрөлгүй хандалт." });
    // }

    // Include the user ID in the pagination filters
    // req.pagination.filters.push({
    //   fieldName: "user_id",
    //   operation: "eq",
    //   value: userId,
    // });
    // const subjectId = req.body.subject_id ?? null;

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const { subjectId } = req.params;
    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      userId: userId,
      subjectId: subjectId,
    };

    // console.log(req);

    const { totalSubjectSchedules, subjectSchedules } =
      await subjectScheduleService.getAllSubjectSchedules(queryOptions);

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalSubjectSchedules / pageSize),
        per_page: pageSize,
        total_elements: totalSubjectSchedules,
      },
      data: subjectSchedules,
    });
  } catch (error) {
    responses.internalServerError(res, error);
  }
};

exports.getSubjectSchedulesWithoutBody = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { subjectId } = req.params;
    const subjectSchedules =
      await subjectScheduleService.getAllSubjectSchedules({
        subjectId,
        isWithoutBody: true,
        userId,
      });
    res.json({ data: subjectSchedules });
  } catch (error) {
    responses.internalServerError(res, error);
  }
};

exports.getSubjectSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subjectSchedule = await subjectScheduleService.getSubjectScheduleById(
      id
    );
    res.json(subjectSchedule);
  } catch (error) {
    responses.internalServerError(res, error);
  }
};

exports.createSubjectSchedule = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res
        .status(403)
        .json({ message: "User ID is required to create a subjectSchedule." });
    }

    const newObject = await subjectScheduleService.createSubjectSchedule(
      req.body,
      userId
    );
    responses.created(res, newObject);
  } catch (error) {
    responses.internalServerError(res, error);
  }
};

exports.updateSubjectSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    await subjectScheduleService.updateSubjectSchedule(id, req.body);
    responses.updated(res, req.body);
  } catch (error) {
    responses.internalServerError(res, error);
  }
};

exports.deleteSubjectSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    await subjectScheduleService.deleteSubjectSchedule(id);
    responses.deleted(res, { id: id });
  } catch (error) {
    responses.internalServerError(res, error);
  }
};
