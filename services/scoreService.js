const { Score, Student, Subject, Lab, Assignment } = require("../models");

const transformScores = (score) => {
  const lectureScores = JSON.parse(score.lecture_scores || "[]");
  const labScores = JSON.parse(score.lab_scores || "[]");
  const assignmentScores = JSON.parse(score.assignment_scores || "[]");

  const scoresTransformed = {
    student_code: score.student.student_code,
    student_name: score.student.name,
    extra_point: score.extra_point || 0,
  };

  lectureScores.forEach((lecScore, index) => {
    scoresTransformed[`lec${index + 1}_score`] = lecScore;
  });

  labScores.forEach((lab, index) => {
    scoresTransformed[`lab${index + 1}_score`] = lab.score;
  });

  assignmentScores.forEach((ass, index) => {
    scoresTransformed[`ass${index + 1}_score`] = ass.score;
  });

  return scoresTransformed;
};


const getAllStudentScoresForSubject = async (subjectId, pageNo, pageSize, sortBy, sortOrder) => {
  const offset = pageNo * pageSize;
  const { count: totalScores, rows: scores } = await Score.findAndCountAll({
    where: { subject_id: subjectId },
    include: [
      {
        model: Student,
        attributes: ["student_code", "name"],
      },
    ],
    limit: pageSize,
    offset: offset,
    order: [[sortBy, sortOrder]],
  });

  return {
    totalScores,
    scores: scores.map(transformScores),
  };
};

const updateStudentScore = async (scoreId, updatedScoreData) => {
  return await Score.update(updatedScoreData, {
    where: { id: scoreId },
  });
};

module.exports = {
  getAllStudentScoresForSubject,
  updateStudentScore,
};
