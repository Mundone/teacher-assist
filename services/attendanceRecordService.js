// services/attendanceRecordService.js
const AttendanceRecord = require('../models/attendanceRecord');

const getAllAttendanceRecords = async () => {
  return await AttendanceRecord.findAll();
};

const getAttendanceRecordById = async (id) => {
  return await AttendanceRecord.findByPk(id);
};

const createAttendanceRecord = async (data) => {
  return await AttendanceRecord.create(data);
};

const updateAttendanceRecord = async (id, data) => {
  return await AttendanceRecord.update(data, { where: { id } });
};

const deleteAttendanceRecord = async (id) => {
  return await AttendanceRecord.destroy({ where: { id } });
};

module.exports = {
  getAllAttendanceRecords,
  getAttendanceRecordById,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
};
