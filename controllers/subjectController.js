const subjectService = require("../services/subjectService");

exports.getSubjects = async (req, res, next) => {
  try {
    const { pageNo, pageSize, sortBy, sortOrder } = req.pagination;
    const { totalSubjects, subjects } = await subjectService.getAllSubjects(
      pageNo,
      pageSize,
      sortBy,
      sortOrder
    );

    res.json({
      pagination: {
        current_page_no: pageNo,
        total_pages: Math.ceil(totalSubjects / pageSize),
        per_page: pageSize,
        // total_elements: totalSubjects,
      },
      data: subjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createSubject = async (req, res, next) => {
  try {
    const newSubject = await subjectService.createSubject(req.body);
    res.status(201).json(newSubject);
  } catch (error) {
    next(error);
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await subjectService.updateSubject(id, req.body);
    res.status(200).json({ message: "Subject updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await subjectService.getSubjectById(id);
    res.json(subject);
  } catch (error) {
    next(error);
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await subjectService.deleteSubject(id);
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    next(error);
  }
};
