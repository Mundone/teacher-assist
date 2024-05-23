const settingsService = require("../services/settingsService");
const buildWhereOptions = require("../utils/sequelizeUtil");
const responses = require("../utils/responseUtil");

const getCurrentWeekController = async (req, res, next) => {
  try {
    const objectData = await settingsService.getCurrentWeekService();
    res.json(objectData);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getSemestersController = async (req, res, next) => {
  try {
    const { pageNo, pageSize, sortBy, sortOrder, filters } = req.pagination;

    const queryOptions = {
      where: buildWhereOptions(filters),
      limit: pageSize,
      offset: pageNo * pageSize,
      order: [[sortBy, sortOrder]],
    };

    const { totalObjects, objects } =
      await settingsService.getAllSemestersService(queryOptions);

    res.json({
      pagination: {
        current_page_no: pageNo + 1, // Since pageNo in the response should be one-based
        total_pages: Math.ceil(totalObjects / pageSize),
        per_page: pageSize,
        total_elements: totalObjects,
      },
      data: objects,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getSemesterController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const semester = await settingsService.getSemesterByIdService(id);
    if (!semester) {
      responses.notFound(res);
    }
    res.json(semester);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const createSemesterController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const newObject = await settingsService.createSemesterService(
      req.body,
      userId
    );
    responses.created(res, newObject);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const updateSemesterController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await settingsService.updateSemesterService(id, req.body);
    responses.updated(res, req.body);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const deleteSemesterController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await settingsService.deleteSemesterService(id);
    responses.deleted(res, { id: id });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const changeQRUrlController = async (req, res, next) => {
  try {
    await settingsService.changeQRUrlService(req.body.host);
    responses.updated(res, req.body);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const resetDatabaseController = async (req, res, next) => {
  try {
    await settingsService.resetDatabaseService();
    responses.success(res);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getAllTeacherCountController = async (req, res, next) => {
  try {
    const data = await settingsService.getAllTeacherCountService();
    // if (!data) {
    //   responses.notFound(res);
    // }
    res.json(data);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getAllTeachersSubjectCountController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const data = await settingsService.getAllTeachersSubjectCountService(
      userId
    );
    // if (!data) {
    //   responses.notFound(res);
    // }
    res.json(data);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getAllTeachersStudentCountController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const data = await settingsService.getAllTeachersStudentCountService(
      userId
    );
    if (!data) {
      responses.notFound(res);
    }
    res.json(data);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getAllTeachersSubjecsWithStudentCountController = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user && req.user.id;
    const data =
      await settingsService.getAllTeachersSubjecsWithStudentCountService(
        userId
      );
    if (!data) {
      responses.notFound(res);
    }
    res.json(data);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getStudentsAttendanceWithWeekForEachSubjectController = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user && req.user.id;
    const { subject_id } = req.params;
    const student_count =
      await settingsService.getStudentsAttendanceWithWeekForEachSubjectService(
        subject_id
      );
    if (!student_count) {
      responses.notFound(res);
    } else {
      // res.json(students)
      res.json({
        header_data: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
        ],
        student_count, // Renamed data to students
      });
    }
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const getDashboardController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;

    const allTeacherData = await settingsService.getAllTeacherCountService();
    const allTeacherSubjectData =
      await settingsService.getAllTeachersSubjectCountService(userId);
    const allTeachersStudentData =
      await settingsService.getAllTeachersStudentCountService(userId);
    const allTeachersSubjectStudentData =
      await settingsService.getAllTeachersSubjecsWithStudentCountService(
        userId
      );

    // Combine all data into a single object
    const data = {
      teacher_count: allTeacherData,
      subject_count: allTeacherSubjectData,
      student_count: allTeachersStudentData,
      subject_with_student: allTeachersSubjectStudentData,
    };

    res.json(data);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const askGPTController = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const prompt = req.body.prompt ?? null;
    if (!prompt || !userId) {
      responses.forbidden(res);
    } else {
      const data = await settingsService.callOpenAIChatGPT(userId, prompt);
      if (!data) {
        responses.notFound(res);
      }
      res.json(data);
    }
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  getCurrentWeekController,
  getSemestersController,
  getSemesterController,
  createSemesterController,
  updateSemesterController,
  deleteSemesterController,
  changeQRUrlController,
  resetDatabaseController,
  getAllTeacherCountController,
  getAllTeachersSubjectCountController,
  getAllTeachersStudentCountController,
  getAllTeachersSubjecsWithStudentCountController,
  getStudentsAttendanceWithWeekForEachSubjectController,
  getDashboardController,
  askGPTController,
};
