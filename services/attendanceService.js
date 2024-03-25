const allModels = require("../models");
const QRCode = require("qrcode");
const settingsService = require("../services/settingsService");

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
  const attendanceFullUrl = attendanceRandomPath;
  const responseFullUrl = responseRandomPath;

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
  return await allModels.AttendanceResponse.create({
    attendance_id: objectData.attendance_id,
    submitted_code: objectData.student_code,
    submitted_name: objectData.student_name,
    attendance_date: new Date(),
  });
};

module.exports = {
  getAttendanceByIdService,
  createAttendanceService,
  deleteAttendanceService,
  registerAttendanceService,
};
