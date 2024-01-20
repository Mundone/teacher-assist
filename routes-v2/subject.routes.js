const express = require("express"),
  { sequelize, DataTypes } = require("../db"),
  { Subject, nowTime } = require("../models/models")(sequelize, DataTypes),
  router = express.Router(),
  authenticateToken = require("./auth.routes").authenticateToken,
  upload = require("../config/upload-config"),
  { s3 } = require("../config/aws.config"),
  { DeleteObjectCommand } = require("@aws-sdk/client-s3");

/**
 * @swagger
 * /get_subjects:
 *   get:
 *     summary: Retrieve all subject
 *     tags: [Subject]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter subject
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_subjects", async (req, res) => {
  try {
    const subject = await Subject.findAll({
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
    res.send(subject);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving subject.",
    });
  }
});

/**
 * @swagger
 * /get_subject/{id}:
 *   get:
 *     summary: Retrieve a single subject by ID
 *     tags: [Subject]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the subject
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_subject/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const subject = await Subject.findByPk(id);
    subject
      ? res.send(subject)
      : res.status(404).send({
          message: `Not found Subject with id ${id}.`,
        });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving the Subject.",
    });
  }
});

/**
 * @swagger
 * /create_subject:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subject]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post(
  "/create_subject",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const subject = await Subject.create({
        ...req.body,
        image: req.file ? req.file.path : null,
        createdAt: nowTime,
      });
      res.status(201).send(subject);
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Subject.",
      });
    }
  }
);

/**
 * @swagger
 * /update_subject/{id}:
 *   put:
 *     tags:
 *       - Subject
 *     summary: "Update an subject by ID"
 *     description: "This endpoint updates an existing subject's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the subject to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Subject"
 *     responses:
 *       200:
 *         description: "updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Subject"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "not found"
 *       500:
 *         description: "Error updating subject"
 *     security:
 *       - Authorization: []
 */

router.put(
  "/update_subject/:id",
  upload.single("image"),
  authenticateToken,
  async (req, res) => {
    const id = req.params.id;
    try {
      const subject = await Subject.findByPk(id);
      if (!subject)
        return res
          .status(404)
          .send({ message: `Not found Subject with id ${id}.` });

      if (req.file && subject.image) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: new URL(subject.image).pathname.substring(1),
          })
        );
      }
      await Subject.update(
        {
          ...req.body,
          image: req.file ? req.file.location : subject.image,
          updatedAt: nowTime,
        },
        { where: { id } }
      );
      res.send(await Subject.findByPk(id));
    } catch (err) {
      res
        .status(500)
        .send({ message: `Error updating Subject with id ${id}` });
    }
  }
);

/**
 * @swagger
 * /delete_subject/{id}:
 *   delete:
 *     summary: Delete an subject by its ID
 *     tags: [Subject]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subject to delete
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
 *                   example: Subject was deleted successfully!
 *       404:
 *         description: not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete(
  "/delete_subject/:id",
  authenticateToken,
  async (req, res) => {
    const id = req.params.id;
    try {
      const subject = await Subject.findByPk(id);
      if (!subject)
        return res
          .status(404)
          .send({ message: `Not found Subject with id ${id}.` });

      if (subject.image) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: new URL(subject.image).pathname.substring(1),
          })
        );
      }
      await Subject.destroy({ where: { id } });
      res.status(200).send({
        message: `Subject with id ${id} was deleted successfully!`,
      });
    } catch (err) {
      res
        .status(500)
        .send({ message: "Could not delete Subject with id " + id });
    }
  }
);

module.exports = router;
