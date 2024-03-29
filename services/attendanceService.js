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
  // const attendanceFullUrl = `192.168.65.4:3032${attendanceRandomPath}`;
  // const responseFullUrl = `192.168.65.4:3032${responseRandomPath}`;

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
  const attendanceObject = await allModels.Attendance.findOne({
    where: {
      response_url_path: {
        [Sequelize.Op.like]: "%" + objectData.attendance_url_tail,
      },
    },
    include: [
      {
        model: allModels.SubjectSchedule,
      },
      {
        model: allModels.Lesson,
      },
    ],
  });
  if (!attendanceObject) {
    const error = new Error("Олдсонгүй.");
    error.statusCode = 404;
    throw error;
  }

  const isStudentCorrect = await allModels.StudentSubjectSchedule.findOne({
    include: [
      {
        model: allModels.Student,
        where: {
          student_code: objectData.student_code,
        },
      },
      {
        model: allModels.SubjectSchedule,
        where: {
          id: attendanceObject.subject_schedule_id,
        },
      },
    ],
  });
  if (!isStudentCorrect) {
    const error = new Error("Энэ оюутан энэ хичээлийнх биш байна.");
    error.statusCode = 403;
    throw error;
  }

  const isRegistered = await allModels.AttendanceResponse.findOne({
    where: {
      submitted_code: objectData.student_code,
      attendance_id: attendanceObject.id,
    },
  });

  if (isRegistered) {
    const error = new Error("Энэ оюутан бүртгэгдсэн байна.");
    error.statusCode = 400;
    throw error;
  }

  const returnData = await allModels.AttendanceResponse.create({
    attendance_id: attendanceObject.id,
    submitted_code: objectData.student_code,
    submitted_name: objectData.student_name,
    attendance_date: new Date(),
  });

  const studentObjects = await allModels.Student.findAll({
    where: {
      student_code: objectData.student_code,
    },
  });

  const studentCodes = studentObjects.map(
    (student) => student.dataValues.student_code
  );

  console.log(studentCodes);
  const gradeObject = await allModels.Grade.findOne({
    include: [
      {
        model: allModels.Lesson,
        where: {
          id: attendanceObject.lesson_id,
        },
      },
      {
        model: allModels.Student,
        where: {
          student_code: {
            [Sequelize.Op.in]: studentCodes, // Using the IN operator to check the existence
          },
        },
      },
    ],
  });

  if (!gradeObject) {
    const error = new Error("Дүн олдсонгүй.");
    error.statusCode = 404;
    throw error;
  }

  await gradeService.updateGrade(gradeObject.id, { grade: 1 }, 1, true);

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
