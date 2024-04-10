const allModels = require("../models");
const QRCode = require("qrcode");
const settingsService = require("../services/settingsService");
const gradeService = require("../services/gradeService");
const { Sequelize } = require("sequelize");

const getAttendanceByIdService = async (id, userId) => {
  const attendance = await allModels.Attendance.findOne({
    include: [
      {
        model: allModels.SubjectSchedule,
      },
    ],
    where: { id },
  });

  if (!attendance) {
    const error = new Error("Олдсонгүй.");
    error.statusCode = 404;
    throw error;
  }

  await checkIfUserCorrect(attendance.subject_schedule_id, userId);

  return await allModels.Attendance.findByPk(id);
};

const createAttendanceService = async (objectData, protocol, host, userId) => {
  await checkIfUserCorrect(objectData.subject_schedule_id, userId);

  const attendanceRandomPath = `/attendance/${Math.random()
    .toString(36)
    .substring(2, 15)}`;
  const responseRandomPath = `/attendance/response/${Math.random()
    .toString(36)
    .substring(2, 15)}`;
  // const fullUrl = `${protocol}://${host}${attendancePath}`;
  const attendanceFullUrl = `https://www.teachas.online${attendanceRandomPath}`;
  const responseFullUrl = `https://www.teachas.online${responseRandomPath}`;
  // const attendanceFullUrl = `192.168.165.4:3032${attendanceRandomPath}`;
  // const responseFullUrl = `192.168.165.4:3032${responseRandomPath}`;

  const qrCodeImage = await QRCode.toDataURL(responseFullUrl);

  const week = await settingsService.getCurrentWeekService();

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
    latitude,
    longitude,
    duration,
  });
};

const deleteAttendanceService = async (id, userId) => {
  const attendance = await allModels.Attendance.findOne({
    include: [
      {
        model: allModels.SubjectSchedule,
      },
    ],
    where: { id },
  });

  if (!attendance) {
    const error = new Error("Олдсонгүй.");
    error.statusCode = 404;
    throw error;
  }

  await checkIfUserCorrect(attendance.subject_schedule_id, userId);
  return await allModels.Attendance.update(
    { is_active: false, expired_at: new Date() },
    {
      where: { id: id },
    }
  );
};

const registerAttendanceService = async (objectData) => {
  // Fetch the necessary attendance object along with the related subject schedule and lesson in one go
  const attendanceObject = await allModels.Attendance.findOne({
    where: {
      response_url_path: {
        [Sequelize.Op.like]: "%" + objectData.attendance_url_tail,
      },
    },
    include: [allModels.SubjectSchedule, allModels.Lesson],
  });

  if (!attendanceObject) {
    throw new Error("Олдсонгүй.", 404);
  }

  // Check if the student is related to the subject schedule in one query
  const studentCount = await allModels.StudentSubjectSchedule.count({
    where: {
      '$Student.student_code$': objectData.student_code,
      subject_schedule_id: attendanceObject.subject_schedule_id,
    },
    include: [{
      model: allModels.Student,
      attributes: [],
    }],
  });

  if (studentCount === 0) {
    throw new Error("Энэ оюутан энэ хичээлийнх биш байна.", 403);
  }

  // Check if the student has already registered
  const isRegistered = await allModels.AttendanceResponse.count({
    where: {
      submitted_code: objectData.student_code,
      attendance_id: attendanceObject.id,
    },
  });

  if (isRegistered > 0) {
    throw new Error("Энэ оюутан бүртгэгдсэн байна.", 400);
  }

  // Create the attendance response
  const returnData = await allModels.AttendanceResponse.create({
    attendance_id: attendanceObject.id,
    submitted_code: objectData.student_code,
    submitted_name: objectData.student_name,
    attendance_date: new Date(),
  });

  // Since the student is already verified above, directly update the grade without re-fetching the student
  await gradeService.updateGrade(attendanceObject.lesson_id, { grade: 1 }, objectData.student_code, true);

  return returnData;
};


const getAllAttendanceResponsesService = async ({
  where,
  limit,
  offset,
  order,
  subjectScheduleId,
  userId,
}) => {
  await checkIfUserCorrect(subjectScheduleId, userId);

  const { count: totalAttendanceResponses, rows: attendanceResponses } =
    await allModels.AttendanceResponse.findAndCountAll({
      attributes: [
        "id",
        // "attendance_id",
        "submitted_name",
        "submitted_code",
        "createdAt",
      ],
      include: [
        {
          model: allModels.Attendance,
          where: {
            subject_schedule_id: subjectScheduleId,
          },
          attributes: [
            // "id",
            // "lesson_id",
            // "subject_schedule_id",
            // "qr_code",
            // "response_url_path",
            // "is_active",
            // "expired_at",
            // "usage_count",
          ],
        },
      ],
      where: where,
      limit: limit,
      offset: offset,
      order: order,
      distinct: true,
    });
  return {
    totalAttendanceResponses,
    attendanceResponses,
  };
};

async function checkIfUserCorrect(subjectScheduleId, userId) {
  const isUserCorrect = await allModels.SubjectSchedule.findByPk(
    subjectScheduleId,
    {
      include: [
        {
          model: allModels.Subject,
          attributes: ["id", "user_id"],
          where: { user_id: userId },
        },
      ],
    }
  );

  if (!isUserCorrect) {
    const error = new Error("Зөвшөөрөлгүй хандалт.");
    error.statusCode = 403;
    throw error;
  }
}

module.exports = {
  getAttendanceByIdService,
  createAttendanceService,
  deleteAttendanceService,
  registerAttendanceService,
  getAllAttendanceResponsesService,
};
