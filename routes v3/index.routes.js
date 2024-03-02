const router = require("express").Router();

const authRouter = require('./auth.routes');
const attendanceRecordRouter = require('./attendanceRecord.routes');
const lectureScheduleRouter = require('./lectureSchedule.routes');
const scoreRouter = require('./score.routes');
const studentRouter = require('./student.routes');
const subjectRouter = require('./subject.routes');
const teacherRouter = require('./teacher.routes');
const teacherFileRouter = require('./teacherFile.routes');
const teacherRoleRouter = require('./teacherRole.routes');

router.use('/', attendanceRecordRouter);
router.use('/', lectureScheduleRouter);
router.use('/', scoreRouter);
router.use('/', studentRouter);
router.use('/', subjectRouter);
router.use('/', teacherRouter);
router.use('/', teacherFileRouter);
router.use('/', teacherRoleRouter);
router.use('/', authRouter);


router.get('/', function(req, res, next) {
  res.render('index', { title: 'ШУТИС-ын багш нарын системд тавтай морил. Энэ бол backend.' });
});

module.exports = router;
