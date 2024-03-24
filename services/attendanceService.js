const allModels = require("../models");
const QRCode = require("qrcode");

const getAttendanceByIdService = async (id) => {
  return await allModels.Attendance.findByPk(id);
};

const createAttendanceService = async (objectData, protocol, host) => {
  const randomPath = `/attendance/${Math.random()
    .toString(36)
    .substring(2, 15)}`;
  const fullUrl = `${protocol}://${host}${randomPath}`;
  const qrCodeImage = await QRCode.toDataURL(fullUrl);

  return await allModels.Attendance.create({
    ...objectData,
    qr_code: qrCodeImage,
    url_path: fullUrl,
    is_active: true,
    usage_count: 0,
  });
};

const deleteAttendanceService = async (id) => {
  return await allModels.Attendance.update(
    { is_active: false, expired_at: new Date() },
    {
      where: { id: id },
    }
  );
};

module.exports = {
  getAttendanceByIdService,
  createAttendanceService,
  deleteAttendanceService,
};
