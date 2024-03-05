const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getAllSubjects = async (pageNo, pageSize, sortBy, sortOrder) => {
  const offset = pageNo * pageSize;

  let { count: totalSubjects, rows: subjects } =
    await allModels.Subject.findAndCountAll({
      include: [
        {
          model: allModels.Teacher,
          attributes: ["id", "name", "email", "code"],
          include: [
            {
              model: allModels.TeachingAssignment,
              attributes: [
                "id",
                "teacher_id",
                "subject_id",
                "lesson_type_id",
                // "createdAt",
                // "updatedAt",
              ],

              include: [
                {
                  model: allModels.LessonType,
                },
              ],
              // Initially, don't filter here; we'll filter manually later
            },
          ],
        },
      ],
      attributes: [
        "id",
        "subject_name",
        "createdAt",
        "updatedAt",
        "main_teacher_id",
      ],
      limit: pageSize,
      offset: offset,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

  // Manual post-processing to filter TeachingAssignments
  subjects = subjects.map((subject) => subject.get({ plain: true })); // Convert all subjects to plain objects first

  subjects = subjects.map((subject) => {
    if (subject.teachers && subject.teachers.length > 0) {
      subject.teachers = subject.teachers.map((teacher) => {
        // Filter teaching_assignments to ensure they match the current subject's ID
        if (teacher.teaching_assignments) {
          teacher.teaching_assignments = teacher.teaching_assignments.filter(
            (ta) => ta.subject_id === subject.id
          );
        } else {
          teacher.teaching_assignments = []; // Ensure it's an array even if undefined
        }

        // Explicitly remove the teaching_assignment object
        const { teaching_assignment, ...teacherWithoutAssignment } = teacher;
        return teacherWithoutAssignment;
      });
    } else {
      subject.teachers = [];
    }
    return subject; // Return the modified subject object
  });

  return {
    totalSubjects,
    subjects,
  };
};

const createSubject = async (subjectData) => {
  return await Subject.create(subjectData);
};

const updateSubject = async (id, subjectData) => {
  return await Subject.update(subjectData, {
    where: { id: id },
  });
};

const getSubjectById = async (id) => {
  return await Subject.findByPk(id);
};

const deleteSubject = async (id) => {
  return await Subject.destroy({
    where: { id: id },
  });
};

module.exports = {
  getAllSubjects,
  createSubject,
  updateSubject,
  getSubjectById,
  deleteSubject,
};
