const AttendanceRecordService = require('../services/attendanceRecordService');

exports.getAttendanceRecords = async (req, res, next) => {
  try {
    const attendanceRecords = await AttendanceRecordService.getAllAttendanceRecords();
    res.json(attendanceRecords);
  } catch (error) {
    next(error);
  }
};
