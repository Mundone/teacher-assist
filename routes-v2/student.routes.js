const express = require("express"),
  { sequelize, DataTypes } = require("../db"),
  { Student, nowTime } = require("../models/models")(sequelize, DataTypes),
  router = express.Router(),
  authenticateToken = require("./auth.routes").authenticateToken,
  upload = require("../config/upload-config"),
  { s3 } = require("../config/aws.config"),
  { DeleteObjectCommand } = require("@aws-sdk/client-s3");

/**
 * @swagger
 * /get_students:
 *   get:
 *     summary: Retrieve all student
 *     tags: [Student]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter student
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_students", async (req, res) => {
  try {
    const student = await Student.findAll({
      ...(req.query.search && {
        where: {
          title: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("title")),
            "LIKE",
            `%${req.query.search.toLowerCase()}%`
          ),
        },
      }),
    });
    res.send(student);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving student.",
    });
  }
});

/**
 * @swagger
 * /get_student/{id}:
 *   get:
 *     summary: Retrieve a single student by ID
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the student
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_student/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const student = await Student.findByPk(id);
    student
      ? res.send(student)
      : res.status(404).send({
          message: `Not found Student with id ${id}.`,
        });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving the Student.",
    });
  }
});

/**
 * @swagger
 * /create_student:
 *   post:
 *     summary: Create a new student
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post(
  "/create_student",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const student = await Student.create({
        ...req.body,
        image: req.file ? req.file.path : null,
        createdAt: nowTime,
      });
      res.status(201).send(student);
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Student.",
      });
    }
  }
);

/**
 * @swagger
 * /update_student/{id}:
 *   put:
 *     tags:
 *       - Student
 *     summary: "Update an student by ID"
 *     description: "This endpoint updates an existing student's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the student to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Student"
 *     responses:
 *       200:
 *         description: "updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Student"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "not found"
 *       500:
 *         description: "Error updating student"
 *     security:
 *       - Authorization: []
 */

router.put(
  "/update_student/:id",
  upload.single("image"),
  authenticateToken,
  async (req, res) => {
    const id = req.params.id;
    try {
      const student = await Student.findByPk(id);
      if (!student)
        return res
          .status(404)
          .send({ message: `Not found Student with id ${id}.` });

      if (req.file && student.image) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: new URL(student.image).pathname.substring(1),
          })
        );
      }
      await Student.update(
        {
          ...req.body,
          image: req.file ? req.file.location : student.image,
          updatedAt: nowTime,
        },
        { where: { id } }
      );
      res.send(await Student.findByPk(id));
    } catch (err) {
      res
        .status(500)
        .send({ message: `Error updating Student with id ${id}` });
    }
  }
);

/**
 * @swagger
 * /delete_student/{id}:
 *   delete:
 *     summary: Delete an student by its ID
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the student to delete
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the successful deletion
 *                   example: Student was deleted successfully!
 *       404:
 *         description: not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete(
  "/delete_student/:id",
  authenticateToken,
  async (req, res) => {
    const id = req.params.id;
    try {
      const student = await Student.findByPk(id);
      if (!student)
        return res
          .status(404)
          .send({ message: `Not found Student with id ${id}.` });

      if (student.image) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: new URL(student.image).pathname.substring(1),
          })
        );
      }
      await Student.destroy({ where: { id } });
      res.status(200).send({
        message: `Student with id ${id} was deleted successfully!`,
      });
    } catch (err) {
      res
        .status(500)
        .send({ message: "Could not delete Student with id " + id });
    }
  }
);

module.exports = router;
