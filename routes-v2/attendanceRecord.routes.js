const express = require("express"),
  { sequelize, DataTypes } = require("../../../../db"),
  { AttendanceRecord, nowTime } = require("../models/models")(sequelize, DataTypes),
  router = express.Router(),
  authenticateToken = require("./auth.routes").authenticateToken,
  upload = require("../config/upload-config"),
  { s3 } = require("../config/aws.config"),
  { DeleteObjectCommand } = require("@aws-sdk/client-s3");

/**
 * @swagger
 * /get_attendance_records:
 *   get:
 *     summary: Retrieve all attendanceRecord
 *     tags: [AttendanceRecord]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter attendanceRecord
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AttendanceRecord'
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_attendance_records", async (req, res) => {
  try {
    const attendanceRecord = await AttendanceRecord.findAll({
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
    res.send(attendanceRecord);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving attendanceRecord.",
    });
  }
});

/**
 * @swagger
 * /get_attendance_record/{id}:
 *   get:
 *     summary: Retrieve a single attendanceRecord by ID
 *     tags: [AttendanceRecord]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the attendanceRecord
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceRecord'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_attendance_record/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const attendanceRecord = await AttendanceRecord.findByPk(id);
    attendanceRecord
      ? res.send(attendanceRecord)
      : res.status(404).send({
          message: `Not found AttendanceRecord with id ${id}.`,
        });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving the AttendanceRecord.",
    });
  }
});

/**
 * @swagger
 * /create_attendance_record:
 *   post:
 *     summary: Create a new attendanceRecord
 *     tags: [AttendanceRecord]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceRecord'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceRecord'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post(
  "/create_attendance_record",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const attendanceRecord = await AttendanceRecord.create({
        ...req.body,
        image: req.file ? req.file.path : null,
        createdAt: nowTime,
      });
      res.status(201).send(attendanceRecord);
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the AttendanceRecord.",
      });
    }
  }
);

/**
 * @swagger
 * /update_attendance_record/{id}:
 *   put:
 *     tags:
 *       - AttendanceRecord
 *     summary: "Update an attendanceRecord by ID"
 *     description: "This endpoint updates an existing attendanceRecord's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the attendanceRecord to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AttendanceRecord"
 *     responses:
 *       200:
 *         description: "updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AttendanceRecord"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "not found"
 *       500:
 *         description: "Error updating attendanceRecord"
 *     security:
 *       - Authorization: []
 */

router.put(
  "/update_attendance_record/:id",
  upload.single("image"),
  authenticateToken,
  async (req, res) => {
    const id = req.params.id;
    try {
      const attendanceRecord = await AttendanceRecord.findByPk(id);
      if (!attendanceRecord)
        return res
          .status(404)
          .send({ message: `Not found AttendanceRecord with id ${id}.` });

      if (req.file && attendanceRecord.image) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: new URL(attendanceRecord.image).pathname.substring(1),
          })
        );
      }
      await AttendanceRecord.update(
        {
          ...req.body,
          image: req.file ? req.file.location : attendanceRecord.image,
          updatedAt: nowTime,
        },
        { where: { id } }
      );
      res.send(await AttendanceRecord.findByPk(id));
    } catch (err) {
      res
        .status(500)
        .send({ message: `Error updating AttendanceRecord with id ${id}` });
    }
  }
);

/**
 * @swagger
 * /delete_attendance_record/{id}:
 *   delete:
 *     summary: Delete an attendanceRecord by its ID
 *     tags: [AttendanceRecord]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the attendanceRecord to delete
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
 *                   example: AttendanceRecord was deleted successfully!
 *       404:
 *         description: not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete(
  "/delete_attendance_record/:id",
  authenticateToken,
  async (req, res) => {
    const id = req.params.id;
    try {
      const attendanceRecord = await AttendanceRecord.findByPk(id);
      if (!attendanceRecord)
        return res
          .status(404)
          .send({ message: `Not found AttendanceRecord with id ${id}.` });

      if (attendanceRecord.image) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: new URL(attendanceRecord.image).pathname.substring(1),
          })
        );
      }
      await AttendanceRecord.destroy({ where: { id } });
      res.status(200).send({
        message: `AttendanceRecord with id ${id} was deleted successfully!`,
      });
    } catch (err) {
      res
        .status(500)
        .send({ message: "Could not delete AttendanceRecord with id " + id });
    }
  }
);

module.exports = router;
