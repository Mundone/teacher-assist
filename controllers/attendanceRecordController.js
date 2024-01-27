// controllers/attendanceRecordController.js
const AttendanceRecordService = require('../services/attendanceRecordService');

exports.getAttendanceRecords = async (req, res, next) => {
  try {
    const attendanceRecords = await AttendanceRecordService.getAllAttendanceRecords();
    res.json(attendanceRecords);
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attendanceRecord = await AttendanceRecordService.getAttendanceRecordById(id);
    if (!attendanceRecord) {
      return res.status(404).json({ message: "AttendanceRecord not found" });
    }
    res.json(attendanceRecord);
  } catch (error) {
    next(error);
  }
};

exports.createAttendanceRecord = async (req, res, next) => {
  try {
    const newAttendanceRecord = await AttendanceRecordService.createAttendanceRecord(req.body);
    res.status(201).json(newAttendanceRecord);
  } catch (error) {
    next(error);
  }
};

exports.updateAttendanceRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    await AttendanceRecordService.updateAttendanceRecord(id, req.body);
    res.json({ message: "AttendanceRecord updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.deleteAttendanceRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    await AttendanceRecordService.deleteAttendanceRecord(id);
    res.json({ message: "AttendanceRecord deleted successfully" });
  } catch (error) {
    next(error);
  }
};
