const express = require('express'),
      { sequelize, DataTypes } = require("../db"),
      { TeacherRole, nowTime } = require("../../models/models")(sequelize, DataTypes),
      router = express.Router(),
      authenticateToken = require('./auth.routes').authenticateToken;

/**
 * @swagger
 * /get_teacher_roles:
 *   get:
 *     summary: Retrieve all teacherRoles
 *     tags: [TeacherRole]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter teacherRoles
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeacherRole'
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_teacher_roles", async (req, res) => {
  try {
      const teacherRoles = await TeacherRole.findAll({
          ...(req.query.search && {
              where: { query: { [sequelize.Op.like]: `%${req.query.search.toLowerCase()}%` } }
          })
      });
      res.send(teacherRoles);
  } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving teacherRoles." });
  }
});

/**
 * @swagger
 * /get_teacher_role/{id}:
 *   get:
 *     summary: Retrieve a single labSchedule by ID
 *     tags: [TeacherRole]
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
 *               $ref: '#/components/schemas/TeacherRole'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_teacher_role/:id", async (req, res) => {
  const id = req.params.id;
  try {
      const labSchedule = await TeacherRole.findByPk(id);
      labSchedule ? res.send(labSchedule) : res.status(404).send({ message: `Not found TeacherRole with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving the TeacherRole." });
  }
});

/**
 * @swagger
 * /create_teacher_role:
 *   post:
 *     summary: Create a new labSchedule
 *     tags: [TeacherRole]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeacherRole'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherRole'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
*     security:
*       - Authorization: []
 */

router.post("/create_teacher_role", authenticateToken, async (req, res) => {
  try {
      const labSchedule = await TeacherRole.create({ ...req.body, createdAt: nowTime });
      res.status(201).send(labSchedule);
  } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while creating the TeacherRole." });
  }
});

/**
 * @swagger
 * /update_teacher_role/{id}:
 *   put:
 *     tags:
 *       - TeacherRole
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
 *       description: "TeacherRole data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TeacherRole"
 *     responses:
 *       200:
 *         description: "TeacherRole updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TeacherRole"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "TeacherRole not found"
 *       500:
 *         description: "Error updating labSchedule"
*     security:
*       - Authorization: []
 */
router.put("/update_teacher_role/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
      const updated = await TeacherRole.update({ ...req.body, updatedAt: nowTime }, { where: { id } });
      updated[0] ? res.send(await TeacherRole.findByPk(id)) : res.status(404).send({ message: `Not found TeacherRole with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: `Error updating TeacherRole with id ${id}` });
  }
});

/**
 * @swagger
 * /delete_teacher_role/{id}:
 *   delete:
 *     summary: Delete an labSchedule by its ID
 *     tags: [TeacherRole]
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
 *         description: TeacherRole deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the successful deletion
 *                   example: TeacherRole was deleted successfully!
 *       404:
 *         description: TeacherRole not found
 *       500:
 *         description: Internal server error
*     security:
*       - Authorization: []
 */
router.delete("/delete_teacher_role/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
      const deleted = await TeacherRole.destroy({ where: { id } });
      deleted ? res.status(200).send({ message: `TeacherRole with id ${id} was deleted successfully!` }) : res.status(404).send({ message: `Not found TeacherRole with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: "Could not delete TeacherRole with id " + id });
  }
});

module.exports = router;
