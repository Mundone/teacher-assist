const express = require("express"),
  { sequelize, DataTypes } = require("../db"),
  { TeacherFile, nowTime } = require("../../models/models")(sequelize, DataTypes),
  router = express.Router(),
  authenticateToken = require("./auth.routes").authenticateToken,
  upload = require("../../config/upload-config"),
  { s3 } = require("../../config/aws.config"),
  { DeleteObjectCommand } = require("@aws-sdk/client-s3");

/**
 * @swagger
 * /get_teacher_files:
 *   get:
 *     summary: Retrieve all teacherFile
 *     tags: [TeacherFile]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter teacherFile
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeacherFile'
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_teacher_files", async (req, res) => {
  try {
    const teacherFile = await TeacherFile.findAll({
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
    res.send(teacherFile);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving teacherFile.",
    });
  }
});

/**
 * @swagger
 * /get_teacher_file/{id}:
 *   get:
 *     summary: Retrieve a single teacherFile by ID
 *     tags: [TeacherFile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the teacherFile
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherFile'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_teacher_file/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const teacherFile = await TeacherFile.findByPk(id);
    teacherFile
      ? res.send(teacherFile)
      : res.status(404).send({
          message: `Not found TeacherFile with id ${id}.`,
        });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving the TeacherFile.",
    });
  }
});

/**
 * @swagger
 * /create_teacher_file:
 *   post:
 *     summary: Create a new teacherFile
 *     tags: [TeacherFile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeacherFile'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherFile'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post(
  "/create_teacher_file",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const teacherFile = await TeacherFile.create({
        ...req.body,
        image: req.file ? req.file.path : null,
        createdAt: nowTime,
      });
      res.status(201).send(teacherFile);
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the TeacherFile.",
      });
    }
  }
);

/**
 * @swagger
 * /update_teacher_file/{id}:
 *   put:
 *     tags:
 *       - TeacherFile
 *     summary: "Update an teacherFile by ID"
 *     description: "This endpoint updates an existing teacherFile's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the teacherFile to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TeacherFile"
 *     responses:
 *       200:
 *         description: "updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TeacherFile"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "not found"
 *       500:
 *         description: "Error updating teacherFile"
 *     security:
 *       - Authorization: []
 */

router.put(
  "/update_teacher_file/:id",
  upload.single("image"),
  authenticateToken,
  async (req, res) => {
    const id = req.params.id;
    try {
      const teacherFile = await TeacherFile.findByPk(id);
      if (!teacherFile)
        return res
          .status(404)
          .send({ message: `Not found TeacherFile with id ${id}.` });

      if (req.file && teacherFile.image) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: new URL(teacherFile.image).pathname.substring(1),
          })
        );
      }
      await TeacherFile.update(
        {
          ...req.body,
          image: req.file ? req.file.location : teacherFile.image,
          updatedAt: nowTime,
        },
        { where: { id } }
      );
      res.send(await TeacherFile.findByPk(id));
    } catch (err) {
      res
        .status(500)
        .send({ message: `Error updating TeacherFile with id ${id}` });
    }
  }
);

/**
 * @swagger
 * /delete_teacher_file/{id}:
 *   delete:
 *     summary: Delete an teacherFile by its ID
 *     tags: [TeacherFile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacherFile to delete
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
 *                   example: TeacherFile was deleted successfully!
 *       404:
 *         description: not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete(
  "/delete_teacher_file/:id",
  authenticateToken,
  async (req, res) => {
    const id = req.params.id;
    try {
      const teacherFile = await TeacherFile.findByPk(id);
      if (!teacherFile)
        return res
          .status(404)
          .send({ message: `Not found TeacherFile with id ${id}.` });

      if (teacherFile.image) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: new URL(teacherFile.image).pathname.substring(1),
          })
        );
      }
      await TeacherFile.destroy({ where: { id } });
      res.status(200).send({
        message: `TeacherFile with id ${id} was deleted successfully!`,
      });
    } catch (err) {
      res
        .status(500)
        .send({ message: "Could not delete TeacherFile with id " + id });
    }
  }
);

module.exports = router;
