const { Score, Student, Subject, Lab, Assignment } = require("../models");

const parseScores = (score, week) => {
  // Assuming score fields are JSON strings with a structure that includes weekly data
  const parsedLectureScores = JSON.parse(score.LectureScores || "{}");
  const parsedLabScores = JSON.parse(score.LabScores || "{}");
  const parsedAssignmentScores = JSON.parse(score.AssignmentScores || "{}");

  // Extract the scores for the specified week
  const lectureScore = parsedLectureScores[`week${week}`] || 0;
  const labScore = parsedLabScores[`week${week}`] || 0;
  const assignmentScore = parsedAssignmentScores[`week${week}`] || 0;

  return {
    lectureScore,
    labScore,
    assignmentScore,
  };
};

const getAllStudentScoresForSubjectAndWeek = async (subjectId, week, pageNo, pageSize, sortBy, sortOrder) => {
  const sortByValid = sortBy || "StudentID"; // Replace 'StudentID' with your default sort column if different
  const sortOrderValid = sortOrder === "desc" ? "DESC" : "ASC"; // Default to ascending if sortOrder is not 'desc'

  const offset = pageNo * pageSize;
  
  // In your scoreService or wherever the findAll call is made
  const scores = await Score.findAll({
    where: { SubjectID: subjectId },
    include: [
      {
        model: Student,
        attributes: ["StudentCode", "Name"],
      },
      // Add other includes if necessary
    ],
    limit: pageSize,
    offset: offset,
    // Use the validated sort parameters
    order: [[sortByValid, sortOrderValid]],
  });

  // Process the scores to format them for the table
  return scores.map((score) => {
    const { lectureScore, labScore, assignmentScore } = parseScores(score, week);

    return {
      StudentCode: score.Student.StudentCode,
      StudentName: score.Student.Name,
      LectureScore: lectureScore,
      LabScore: labScore,
      AssignmentScore: assignmentScore,
      ExtraPoint: score.ExtraPoint || 0,
    };
  });
};

const updateStudentScore = async (scoreId, updatedScoreData) => {
  return await Score.update(updatedScoreData, {
    where: { ScoreID: scoreId },
  });
};

module.exports = {
  getAllStudentScoresForSubjectAndWeek,
  updateStudentScore,
};
