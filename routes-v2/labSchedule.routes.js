const express = require('express'),
      { sequelize, DataTypes } = require("../db"),
      { LabSchedule, nowTime } = require("../models/models")(sequelize, DataTypes),
      router = express.Router(),
      authenticateToken = require('./auth.routes').authenticateToken;

/**
 * @swagger
 * /get_lab_schedules:
 *   get:
 *     summary: Retrieve all labSchedules
 *     tags: [LabSchedule]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter labSchedules
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LabSchedule'
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_lab_schedules", async (req, res) => {
  try {
      const labSchedules = await LabSchedule.findAll({
          ...(req.query.search && {
              where: { query: { [sequelize.Op.like]: `%${req.query.search.toLowerCase()}%` } }
          })
      });
      res.send(labSchedules);
  } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving labSchedules." });
  }
});

/**
 * @swagger
 * /get_lab_schedule/{id}:
 *   get:
 *     summary: Retrieve a single labSchedule by ID
 *     tags: [LabSchedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the labSchedule
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LabSchedule'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_lab_schedule/:id", async (req, res) => {
  const id = req.params.id;
  try {
      const labSchedule = await LabSchedule.findByPk(id);
      labSchedule ? res.send(labSchedule) : res.status(404).send({ message: `Not found LabSchedule with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving the LabSchedule." });
  }
});

/**
 * @swagger
 * /create_lab_schedule:
 *   post:
 *     summary: Create a new labSchedule
 *     tags: [LabSchedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LabSchedule'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LabSchedule'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
*     security:
*       - Authorization: []
 */

router.post("/create_lab_schedule", authenticateToken, async (req, res) => {
  try {
      const labSchedule = await LabSchedule.create({ ...req.body, createdAt: nowTime });
      res.status(201).send(labSchedule);
  } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while creating the LabSchedule." });
  }
});

/**
 * @swagger
 * /update_lab_schedule/{id}:
 *   put:
 *     tags:
 *       - LabSchedule
 *     summary: "Update an labSchedule by ID"
 *     description: "This endpoint updates an existing labSchedule's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the labSchedule to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "LabSchedule data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LabSchedule"
 *     responses:
 *       200:
 *         description: "LabSchedule updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LabSchedule"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "LabSchedule not found"
 *       500:
 *         description: "Error updating labSchedule"
*     security:
*       - Authorization: []
 */
router.put("/update_lab_schedule/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
      const updated = await LabSchedule.update({ ...req.body, updatedAt: nowTime }, { where: { id } });
      updated[0] ? res.send(await LabSchedule.findByPk(id)) : res.status(404).send({ message: `Not found LabSchedule with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: `Error updating LabSchedule with id ${id}` });
  }
});

/**
 * @swagger
 * /delete_lab_schedule/{id}:
 *   delete:
 *     summary: Delete an labSchedule by its ID
 *     tags: [LabSchedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the labSchedule to delete
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: LabSchedule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the successful deletion
 *                   example: LabSchedule was deleted successfully!
 *       404:
 *         description: LabSchedule not found
 *       500:
 *         description: Internal server error
*     security:
*       - Authorization: []
 */
router.delete("/delete_lab_schedule/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
      const deleted = await LabSchedule.destroy({ where: { id } });
      deleted ? res.status(200).send({ message: `LabSchedule with id ${id} was deleted successfully!` }) : res.status(404).send({ message: `Not found LabSchedule with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: "Could not delete LabSchedule with id " + id });
  }
});

module.exports = router;
