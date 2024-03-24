const router = require("express").Router();

const attendanceRouter = require('./attendance.routes');
const authRouter = require('./auth.routes');
// const attendanceRecordRouter = require('./attendanceRecord.routes');
// const lectureScheduleRouter = require('./lectureSchedule.routes');
const lessonRouter = require('./lesson.routes');
const lessonAssessmentRouter = require('./lessonAssessment.routes');
const lessonTypeRouter = require('./lessonType.routes');
const gradeRouter = require('./grade.routes');
const settingsRouter = require('./settings.routes');
const studentRouter = require('./student.routes');
const subjectRouter = require('./subject.routes');
const subjectScheduleRouter = require('./subjectSchedule.routes');
const userRouter = require('./user.routes');
const userFileRouter = require('./userFile.routes');
const userRoleRouter = require('./userRole.routes');

// router.use('/', attendanceRecordRouter);
// router.use('/', lectureScheduleRouter);
router.use('/', attendanceRouter);
router.use('/', authRouter);
router.use('/', lessonRouter);
router.use('/', lessonAssessmentRouter);
router.use('/', lessonTypeRouter);
router.use('/', gradeRouter);
router.use('/', settingsRouter);
router.use('/', studentRouter);
router.use('/', subjectRouter);
router.use('/', subjectScheduleRouter);
router.use('/', userRouter);
router.use('/', userFileRouter);
router.use('/', userRoleRouter);


router.get('/', function(req, res, next) {
  res.render('index', { title: 'ШУТИС-ын багш нарын системд тавтай морил. Энэ бол backend.' });
});

module.exports = router;
