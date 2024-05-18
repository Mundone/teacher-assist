const allModels = require("../models");
const QRCode = require("qrcode");
const settingsService = require("../services/settingsService");
const gradeService = require("../services/gradeService");
const { Sequelize } = require("sequelize");
const crypto = require("crypto");

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

  // Generate a random string as part of the QR data

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

  console.log(thatLesson)

  // const thatLesson = await allModels.Lesson.findOne({
  //   where: (week_number = objectData.week),
  // });

  const qrContainingText = crypto.randomBytes(50).toString("hex");

  const attendanceObject = await allModels.Attendance.create({
    subject_schedule_id: objectData.subject_schedule_id,
    lesson_id: thatLesson.id,
    // qr_code: qrCodeImage,
    attendance_url_path: attendanceFullUrl,
    response_url_path: responseFullUrl,
    is_active: true,
    usage_count: 0,
    latitude: objectData.latitude,
    longitude: objectData.longitude,
    duration: objectData.duration,
    qr_containing_text: qrContainingText,
  });

  // Combine the random data with attendance_id
  const qrData = JSON.stringify({
    qrContainingText: qrContainingText,
    attendanceId: attendanceObject.id,
  });
  const qrCodeImage = await QRCode.toDataURL(
    qrData
    //   ,{
    //   // errorCorrectionLevel: "H",
    //   type: "image/jpeg",
    //   // quality: 0.3,
    //   // margin: 1,
    //   // width: 256,
    // }
  );

  await attendanceObject.update({
    qr_code: qrCodeImage,
  });

  // const x = JSON.parse(qrCodeImage)
  // console.log(x);

  return attendanceObject;
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
      "$Student.student_code$": objectData.student_code,
      subject_schedule_id: attendanceObject.subject_schedule_id,
    },
    include: [
      {
        model: allModels.Student,
        attributes: [],
      },
    ],
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
  await gradeService.updateGradeService(
    attendanceObject.lesson_id,
    { grade: 1, updatedAt: new Date(), distance: 10 },
    objectData.student_code,
    true
  );

  return returnData;
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters
  const p1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const p2 = (lat2 * Math.PI) / 180;
  const triangle_p = ((lat2 - lat1) * Math.PI) / 180;
  const triangleSigma = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(triangle_p / 2) * Math.sin(triangle_p / 2) +
    Math.cos(p1) *
      Math.cos(p2) *
      Math.sin(triangleSigma / 2) *
      Math.sin(triangleSigma / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in meters
  return distance;
}

const attendanceRadius = 30;

function isWithinRadius(
  attendanceObject,
  objectData,
  radius = attendanceRadius
) {
  const distance = calculateDistance(
    attendanceObject.latitude,
    attendanceObject.longitude,
    objectData.latitude,
    objectData.longitude
  );

  return distance <= radius ? distance : false;
}

const registerAttendanceInMobileService = async (objectData, userId) => {

  const attendanceObject = await allModels.Attendance.findByPk(
    objectData.attendance_id,
    {
      include: [allModels.SubjectSchedule, allModels.Lesson],
    }
  );

  if (!attendanceObject) {
    throw new Error("Олдсонгүй.", 404);
  }

  await attendanceObject.update({
    usage_count: attendanceObject.usage_count + 1,
  });
  const studentDistance = isWithinRadius(attendanceObject, objectData);

  // if (studentDistance) {
    const studentObject = await allModels.Student.findByPk(userId);

    // Check if the student is related to the subject schedule in one query
    // const studentCount = await allModels.StudentSubjectSchedule.count({
    //   where: {
    //     "$Student.student_code$": studentObject.student_code,
    //     subject_schedule_id: attendanceObject.subject_schedule_id,
    //   },
    //   include: [
    //     {
    //       model: allModels.Student,
    //       attributes: [],
    //     },
    //   ],
    // });

    // if (studentCount === 0) {
    //   throw new Error("Энэ оюутан энэ хичээлийнх биш байна.", 403);
    // }

    if (attendanceObject.qr_containing_text == objectData.qr_containing_text) {
      // Check if the student has already registered
      const isRegistered = await allModels.AttendanceResponse.count({
        where: {
          submitted_code: studentObject.student_code,
          attendance_id: attendanceObject.id,
        },
      });

      if (isRegistered > 0) {
        throw new Error("Энэ оюутан бүртгэгдсэн байна.", 400);
      }

      // Create the attendance response
      const returnData = await allModels.AttendanceResponse.create({
        attendance_id: attendanceObject.id,
        submitted_code: studentObject.student_code,
        submitted_name: studentObject.student_name,
        attendance_date: new Date(),
      });

      console.log(studentObject.id);
      console.log(attendanceObject.lesson_id);

      const gradeObject = await allModels.Grade.findOne({
        where: {
          student_id: studentObject.id,
          lesson_id: attendanceObject.lesson_id,
        },
      });

      // Since the student is already verified above, directly update the grade without re-fetching the student
      await gradeService.updateGradeService(
        gradeObject?.id,
        { grade: 1, updatedAt: new Date(), distance: studentDistance },
        null,
        true
      );
      return returnData;
    } else {
      throw new Error("qr string буруу байна.", 400);
    }
  // } else {
  //   throw new Error(
  //     "Байршил " +
  //       attendanceRadius +
  //       "м-ээс хол байна. Багшийн latitude: " +
  //       attendanceObject.latitude +
  //       ", longitude: " +
  //       attendanceObject.longitude +
  //       ". Оюутны latitude: " +
  //       objectData.latitude +
  //       ", longitude: " +
  //       objectData.longitude,
  //     400
  //   );
  // }
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

const getStudentsWithAttendanceService = async ({
  where,
  limit,
  offset,
  order,
  attendanceId,
  userId,
}) => {
  // console.log(attendanceId);
  const attendanceObject = await allModels.Attendance.findByPk(attendanceId);
  // console.log(attendanceObject);
  await checkIfUserCorrect(attendanceObject?.subject_schedule_id, userId);

  const { count: totalAttendanceResponses, rows: attendanceResponses } =
    await allModels.Student.findAndCountAll({
      attributes: ["id", "name", "student_code", "createdAt"],
      include: [
        {
          model: allModels.Grade,
          where: {
            lesson_id: attendanceObject.lesson_id,
          },
          attributes: ["grade", "distance", "updatedAt"],
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
          attributes: ["id", "teacher_user_id"],
          where: { teacher_user_id: userId },
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

// const getStudentsAttendanceListService = async ({
//   where,
//   limit,
//   offset,
//   order,
//   attendanceId,
//   userId,
// }) => {
//   const attendanceObject = allModels.Attendance.findByPk(attendanceId, {
//     include: [
//       {
//         model: allModels.Lesson,
//         include: [
//           {
//             model: allModels.Grade,
//           },
//           {
//             model: allModels.LessonAssessment,
//             where: {
//               is_attendance_add: true,
//             },
//           },
//         ],
//       },
//     ],
//   });

//   return attendanceObject;
//   let { count: totalObjects, rows: objects } =
//     await allModels.Student.findAndCountAll({
//       include: [
//         {
//           model: allModels.UserRole,
//           attributes: ["id", "role_name"],
//         },
//       ],
//       attributes: [
//         "id",
//         "name",
//         "email",
//         "code",
//         "role_id",
//         "school_id",
//         "createdAt",
//       ],

//       where: where,
//       limit: limit,
//       offset: offset,
//       order: order,
//       distinct: true,
//     });

//   return {
//     totalObjects,
//     objects,
//   };
// };

module.exports = {
  getAttendanceByIdService,
  createAttendanceService,
  deleteAttendanceService,
  registerAttendanceService,
  getAllAttendanceResponsesService,
  getStudentsWithAttendanceService,
  registerAttendanceInMobileService,
  // getStudentsAttendanceListService,
};
