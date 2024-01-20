const express = require('express'),
      { sequelize, DataTypes } = require("../db"),
      { LectureSchedule, nowTime } = require("../models/models")(sequelize, DataTypes),
      router = express.Router(),
      authenticateToken = require('./auth.routes').authenticateToken;

/**
 * @swagger
 * /get_lecture_schedules:
 *   get:
 *     summary: Retrieve all lectureSchedules
 *     tags: [LectureSchedule]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter lectureSchedules
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LectureSchedule'
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_lecture_schedules", async (req, res) => {
  try {
      const lectureSchedules = await LectureSchedule.findAll({
          ...(req.query.search && {
              where: { query: { [sequelize.Op.like]: `%${req.query.search.toLowerCase()}%` } }
          })
      });
      res.send(lectureSchedules);
  } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving lectureSchedules." });
  }
});

/**
 * @swagger
 * /get_lecture_schedule/{id}:
 *   get:
 *     summary: Retrieve a single lectureSchedule by ID
 *     tags: [LectureSchedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the lectureSchedule
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LectureSchedule'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_lecture_schedule/:id", async (req, res) => {
  const id = req.params.id;
  try {
      const lectureSchedule = await LectureSchedule.findByPk(id);
      lectureSchedule ? res.send(lectureSchedule) : res.status(404).send({ message: `Not found LectureSchedule with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving the LectureSchedule." });
  }
});

/**
 * @swagger
 * /create_lecture_schedule:
 *   post:
 *     summary: Create a new lectureSchedule
 *     tags: [LectureSchedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LectureSchedule'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LectureSchedule'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
*     security:
*       - Authorization: []
 */

router.post("/create_lecture_schedule", authenticateToken, async (req, res) => {
  try {
      const lectureSchedule = await LectureSchedule.create({ ...req.body, createdAt: nowTime });
      res.status(201).send(lectureSchedule);
  } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while creating the LectureSchedule." });
  }
});

/**
 * @swagger
 * /update_lecture_schedule/{id}:
 *   put:
 *     tags:
 *       - LectureSchedule
 *     summary: "Update an lectureSchedule by ID"
 *     description: "This endpoint updates an existing lectureSchedule's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the lectureSchedule to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "LectureSchedule data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LectureSchedule"
 *     responses:
 *       200:
 *         description: "LectureSchedule updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LectureSchedule"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "LectureSchedule not found"
 *       500:
 *         description: "Error updating lectureSchedule"
*     security:
*       - Authorization: []
 */
router.put("/update_lecture_schedule/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
      const updated = await LectureSchedule.update({ ...req.body, updatedAt: nowTime }, { where: { id } });
      updated[0] ? res.send(await LectureSchedule.findByPk(id)) : res.status(404).send({ message: `Not found LectureSchedule with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: `Error updating LectureSchedule with id ${id}` });
  }
});

/**
 * @swagger
 * /delete_lab_schedule/{id}:
 *   delete:
 *     summary: Delete an lectureSchedule by its ID
 *     tags: [LectureSchedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the lectureSchedule to delete
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: LectureSchedule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the successful deletion
 *                   example: LectureSchedule was deleted successfully!
 *       404:
 *         description: LectureSchedule not found
 *       500:
 *         description: Internal server error
*     security:
*       - Authorization: []
 */
router.delete("/delete_lab_schedule/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
      const deleted = await LectureSchedule.destroy({ where: { id } });
      deleted ? res.status(200).send({ message: `LectureSchedule with id ${id} was deleted successfully!` }) : res.status(404).send({ message: `Not found LectureSchedule with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: "Could not delete LectureSchedule with id " + id });
  }
});

module.exports = router;
