const attendanceService = require("../services/attendanceService");
const responses = require("../utils/responseUtil");

const getAttendanceController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const semester = await attendanceService.getAttendanceByIdService(id);
    if (!semester) {
      responses.notFound(res);
    }
    res.json(semester);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const createAttendanceController = async (req, res, next) => {
  try {
    const newObject = await attendanceService.createAttendanceService(req.body, req.protocol, req.get("host"));
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

const deleteAttendanceController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await attendanceService.deleteAttendanceService(id);
    responses.deleted(res, { id: id });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const registerAttendanceController = async (req, res, next) => {
  try {
    const newObject = await attendanceService.registerAttendanceService(req.body);
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

module.exports = {
  getAttendanceController,
  createAttendanceController,
  deleteAttendanceController,
  registerAttendanceController
};
