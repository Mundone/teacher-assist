const { Score, AttendanceRecord, Student, Subject, LectureSchedule, LabSchedule } = require('../models');

const getAllScores = async () => {
  return await Score.findAll();
};

const getStudentSubjectScores = async (studentId, subjectId) => {
  // Fetch scores for the student in the subject
  // You might need to perform multiple queries and aggregate the results
  // Example:
  const scores = await Score.findAll({
    where: { StudentID: studentId, SubjectID: subjectId },
    include: [{ model: Student }, { model: Subject }]
  });

  // Add additional queries for attendance records and other related data
  // Aggregate and format the data as required

  return scores; // Return the aggregated and formatted data
};

module.exports = {
  getAllScores,
  getStudentSubjectScores,
};
