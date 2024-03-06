const allModels = require("../models");
const { Sequelize } = require("sequelize");

const getAllSubjects = async (pageNo, pageSize, sortBy, sortOrder) => {
  const offset = pageNo * pageSize;

  let { count: totalSubjects, rows: subjects } =
    await allModels.Subject.findAndCountAll({
      include: [
        {
          model: allModels.User,
          attributes: ["id", "name", "email", "code"],
          include: [
            {
              model: allModels.TeachingAssignment,
              attributes: [
                "id",
                "user_id",
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
    if (subject.users && subject.users.length > 0) {
      subject.users = subject.users.map((user) => {
        // Filter teaching_assignments to ensure they match the current subject's ID
        if (user.teaching_assignments) {
          user.teaching_assignments = user.teaching_assignments.filter(
            (ta) => ta.subject_id === subject.id
          );
        } else {
          user.teaching_assignments = []; // Ensure it's an array even if undefined
        }

        // Explicitly remove the teaching_assignment object
        const { teaching_assignment, ...teacherWithoutAssignment } = user;
        return teacherWithoutAssignment;
      });
    } else {
      subject.users = [];
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
