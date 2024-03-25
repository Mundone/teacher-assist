const allModels = require("../models");
const QRCode = require("qrcode");
const settingsService = require("../services/settingsService");
const { Sequelize } = require("sequelize");

const getAttendanceByIdService = async (id) => {
  return await allModels.Attendance.findByPk(id);
};

const createAttendanceService = async (objectData, protocol, host) => {
  const attendanceRandomPath = `/attendance/${Math.random()
    .toString(36)
    .substring(2, 15)}`;
  const responseRandomPath = `/attendance/response/${Math.random()
    .toString(36)
    .substring(2, 15)}`;
  // const fullUrl = `${protocol}://${host}${attendancePath}`;
  // const attendanceFullUrl = `https://www.teachas.online${attendanceRandomPath}`;
  // const responseFullUrl = `https://www.teachas.online${responseRandomPath}`;
  const attendanceFullUrl = `localhost:3032${attendanceRandomPath}`;
  const responseFullUrl = `localhost:3032${responseRandomPath}`;

  const qrCodeImage = await QRCode.toDataURL(responseFullUrl);

  const week = await settingsService.getCurrentWeekService();
  console.log(week.semester.weekNumber);

  let thatLesson = await allModels.Lesson.findOne({
    where: { week_number: week.semester.weekNumber },
    include: {
      model: allModels.LessonAssessment,
      include: {
        model: allModels.LessonType,
        where: { id: objectData.subject_schedule_id },
      },
    },
  });

  if (!thatLesson) {
    thatLesson = await allModels.Lesson.findOne({
      order: [["week_number", "DESC"]], // Orders by week_number in descending order to get the highest
      include: [
        {
          model: allModels.LessonAssessment,
          include: [
            {
              model: allModels.LessonType,
              where: { id: objectData.subject_schedule_id },
            },
          ],
        },
      ],
    });
  }

  // const thatLesson = await allModels.Lesson.findOne({
  //   where: (week_number = objectData.week),
  // });

  return await allModels.Attendance.create({
    subject_schedule_id: objectData.subject_schedule_id,
    lesson_id: thatLesson.id,
    qr_code: qrCodeImage,
    attendance_url_path: attendanceFullUrl,
    response_url_path: responseFullUrl,
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

const registerAttendanceService = async (objectData) => {
  console.log("%" + objectData.attendance_url_tail);
  const attendanceObject = await allModels.Attendance.findOne({
    where: {
      response_url_path: {
        [Sequelize.Op.like]: "%" + objectData.attendance_url_tail,
      },
    },
  });
  console.log(attendanceObject);

  if (!attendanceObject) {
    const error = new Error("EEEROOR.");
    error.statusCode = 404;
    throw error;
  } else {
    const isRegistered = await allModels.AttendanceResponse.findOne({
      where: {
        submitted_code: objectData.student_code,
        attendance_id: attendanceObject.id,
      },
    });

    console.log(isRegistered);

    if (isRegistered) {
      const error = new Error("Энэ оюутан бүртгэгдсэн байна.");
      error.statusCode = 400;
      throw error;
    } else {
      return await allModels.AttendanceResponse.create({
        attendance_id: attendanceObject.id,
        submitted_code: objectData.student_code,
        submitted_name: objectData.student_name,
        attendance_date: new Date(),
      });
    }
  }
};

module.exports = {
  getAttendanceByIdService,
  createAttendanceService,
  deleteAttendanceService,
  registerAttendanceService,
};
