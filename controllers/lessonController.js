const lessonService = require("../services/lessonService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

// const getLessons = async (req, res, next) => {
//   try {
//     const userId = req.user && req.user.id;
//     if (userId != 1 && userId != 2 && userId != 3) {
//       // return res.status(403).json({ message: "Authentication is required." });
//       responses.forbidden(res);
//     }

//     // const subjectId = req.body.subject_id ?? null;
//     const { subjectId } = req.params;

//     if (subjectId == null) {
//       return res
//         .status(400)
//         .json({ error: "subject_id -аа явуулаарай body-оороо." });
//     }

//     const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

//     const queryOptions = {
//       // Assuming you have a function that translates filters to Sequelize where options
//       where: buildWhereOptions(filters),
//       limit: pageSize,
//       offset: pageNo * pageSize,
//       order: [[sortBy, sortOrder]],
//       userId: userId,
//       subjectId: subjectId,
//     };

//     // console.log(req);

//     const { totalLessons, lessons } = await lessonService.getAllLessons(
//       queryOptions
//     );

//     res.json({
//       pagination: {
//         current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
//         total_pages: Math.ceil(totalLessons / pageSize),
//         per_page: pageSize,
//         total_elements: totalLessons,
//       },
//       data: lessons,
//     });
//   } catch (error) {
//     if (error.statusCode == 403) {
//       responses.forbidden(res);
//     }
//     responses.internalServerError(res, error);
//   }
// };

// const getLessonsWithoutBody = async (req, res, next) => {
//   try {
//     const userId = req.user && req.user.id;
//     const { subjectId } = req.params;
//     const lessons = await lessonService.getAllLessons({
//       isWithoutBody: true,
//       subjectId,
//       userId,
//     });
//     res.json(lessons);
//   } catch (error) {
//     if (error.statusCode == 403) {
//       responses.forbidden(res);
//     }
//     responses.internalServerError(res, error);
//   }
// };

// const getLessonById = async (req, res, next) => {
//   try {
//     const userId = req.user && req.user.id;
//     const { id } = req.params;
//     const subject = await lessonService.getLessonById(id, userId);
//     res.json(subject);
//   } catch (error) {
//     next(error);
//   }
// };

// const createLesson = async (req, res, next) => {
//   try {
//     const userId = req.user && req.user.id;
//     const newObject = await lessonService.createLesson(req.body, userId);
//     responses.created(res, newObject);
//   } catch (error) {
//     if (error.statusCode == 403) {
//       responses.forbidden(res);
//     }
//     responses.internalServerError(res, error);
//   }
// };

// const updateLesson = async (req, res, next) => {
//   try {
//     const userId = req.user && req.user.id;
//     const { id } = req.params;
//     await lessonService.updateLesson(id, req.body, userId);
//     responses.updated(res, req.body);
//   } catch (error) {
//     if (error.statusCode == 403) {
//       responses.forbidden(res);
//     }
//     responses.internalServerError(res, error);
//   }
// };

// const deleteLesson = async (req, res, next) => {
//   try {
//     const userId = req.user && req.user.id;
//     const { id } = req.params;
//     await lessonService.deleteLesson(id, userId);
//     responses.deleted(res, { id: id });
//   } catch (error) {
//     if (error.statusCode == 403) {
//       responses.forbidden(res);
//     }
//     responses.internalServerError(res, error);
//   }
// };

const getLessons = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (userId != 1 && userId != 2 && userId != 3) {
      // return res.status(403).json({ message: "Authentication is required." });
      responses.forbidden(res);
    }

    // const subjectId = req.body.subject_id ?? null;
    const { subjectId } = req.params;

    if (subjectId == null) {
      return res
        .status(400)
        .json({ error: "subject_id -аа явуулаарай body-оороо." });
    }

    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      // Assuming you have a function that translates filters to Sequelize where options
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
      userId: userId,
      subjectId: subjectId,
    };

    // console.log(req);

    const { totalLessons, lessons } = await lessonService.getAllLessons(
      queryOptions
    );

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalLessons / pageSize),
        per_page: pageSize,
        total_elements: totalLessons,
      },
      data: lessons,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const getLessonsWithoutBody = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { subjectId } = req.params;
    const lessons = await lessonService.getAllLessons({
      isWithoutBody: true,
      subjectId,
      userId,
    });
    res.json(lessons);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const getLessonById = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    const subject = await lessonService.getLessonById(id, userId);
    res.json(subject);
  } catch (error) {
    next(error);
  }
};

const createLesson = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const newObject = await lessonService.createLesson(req.body, userId);
    responses.created(res, newObject);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    await lessonService.updateLesson(id, req.body, userId);
    responses.updated(res, req.body);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    await lessonService.deleteLesson(id, userId);
    responses.deleted(res, { id: id });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res);
    }
    else{
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getLessons,
  getLessonsWithoutBody,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
