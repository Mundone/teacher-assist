const AttendanceRecord = require('../models/attendanceRecord');

const getAllAttendanceRecords = async () => {
  return await AttendanceRecord.findAll();
};

module.exports = {
  getAllAttendanceRecords,
};
