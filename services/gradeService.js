const { Grade, Student, Subject, Lab, Assignment } = require("../models");

const transformScores = (grade) => {
  const lectureScores = JSON.parse(grade.lecture_scores || "[]");
  const labScores = JSON.parse(grade.lab_scores || "[]");
  const assignmentScores = JSON.parse(grade.assignment_scores || "[]");

  const scoresTransformed = {
    student_code: grade.student.student_code,
    student_name: grade.student.name,
    extra_point: grade.extra_point || 0,
  };

  lectureScores.forEach((lecScore, index) => {
    scoresTransformed[`lec${index + 1}_score`] = lecScore;
  });

  labScores.forEach((lab, index) => {
    scoresTransformed[`lab${index + 1}_score`] = lab.grade;
  });

  assignmentScores.forEach((ass, index) => {
    scoresTransformed[`ass${index + 1}_score`] = ass.grade;
  });

  return scoresTransformed;
};


const getAllStudentScoresForSubject = async (subjectId, pageNo, pageSize, sortBy, sortOrder) => {
  const offset = pageNo * pageSize;
  const { count: totalScores, rows: grades } = await Grade.findAndCountAll({
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
    grades: grades.map(transformScores),
  };
};

const updateStudentScore = async (scoreId, updatedScoreData) => {
  return await Grade.update(updatedScoreData, {
    where: { id: scoreId },
  });
};

module.exports = {
  getAllStudentScoresForSubject,
  updateStudentScore,
};
