const attendanceService = require("../services/attendanceService");
const responses = require("../utils/responseUtil");
const buildWhereOptions = require("../utils/sequelizeUtil");
const { parse, stringify } = require("flatted");

const getAttendanceController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    const semester = await attendanceService.getAttendanceByIdService(
      id,
      userId
    );
    if (!semester) {
      responses.notFound(res);
    } else {
      res.json(semester);
    }
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const createAttendanceController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const newObject = await attendanceService.createAttendanceService(
      req.body,
      req.protocol,
      req.get("host"),
      userId
    );

    const { attendance_url_path, ...filteredObject } = newObject.dataValues;
    responses.created(res, filteredObject);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else if (error.statusCode == 400) {
      responses.badRequest(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const deleteAttendanceController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    await attendanceService.deleteAttendanceService(id, userId);
    responses.deleted(res, { id: id });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const registerAttendanceController = async (req, res, next) => {
  try {
    const newObject = await attendanceService.registerAttendanceService(
      req.body
    );
    responses.created(res, newObject);
  } catch (error) {
    if (error.statusCode == 400) {
      responses.badRequest(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getAllAttendanceResponsesController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;
    const { subject_schedule_id } = req.params;
    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      subjectScheduleId: subject_schedule_id,
      userId,
    };

    const { totalAttendanceResponses, attendanceResponses } =
      await attendanceService.getAllAttendanceResponsesService(queryOptions);

    res.json({
      pagination: {
        current_page_no: pageNo + 1,
        total_pages: Math.ceil(totalAttendanceResponses / pageSize),
        per_page: pageSize,
        total_elements: totalAttendanceResponses,
      },
      data: attendanceResponses,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getStudentsWithAttendanceController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;
    const { attendance_id } = req.params;
    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      attendanceId: attendance_id,
      userId,
    };

    const { totalAttendanceResponses, attendanceResponses } =
      await attendanceService.getStudentsWithAttendanceService(queryOptions);

    const jsonString = stringify(attendanceResponses);
    let flattedResponses = parse(jsonString);

    flattedResponses = flattedResponses.map((data) => {
      return {
        ...data,
        grade:
          data.grades && data.grades.length > 0 ? data.grades[0].grade : null,
        response_date:
          data.grades && data.grades.length > 0 && data.grades[0].grade !== 0
            ? data.grades[0].updatedAt
            : null,
        response_distance:
          data.grades && data.grades.length > 0 && data.grades[0].grade !== 0
            ? data.grades[0].distance
            : null,
        grades: undefined,
      };
    });

    res.json({
      pagination: {
        current_page_no: pageNo + 1,
        total_pages: Math.ceil(totalAttendanceResponses / pageSize),
        per_page: pageSize,
        total_elements: totalAttendanceResponses,
      },
      data: flattedResponses,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getAttendanceController,
  createAttendanceController,
  deleteAttendanceController,
  registerAttendanceController,
  getAllAttendanceResponsesController,
  getStudentsWithAttendanceController,
};
