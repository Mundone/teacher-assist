const express = require('express'),
      { sequelize, DataTypes } = require("../../../../db"),
      models = require("../models/models")(sequelize, DataTypes),
      router = express.Router(),
      authenticateToken = require('./auth.routes').authenticateToken;

    function queryParser(models) {
        return function(req, res, next) {
            let queryOptions = {
                where: {},
                order: [],
                include: []
            };
    
            // Handle filtering
            if (req.query.filter) {
                for (const [key, value] of Object.entries(req.query.filter)) {
                    let [modelName, fieldName] = key.split('.');
                    
                    if (modelName && fieldName && models[modelName]) {
                        // Filtering on associated model's field
                        queryOptions.include.push({
                            model: models[modelName],
                            as: modelName,
                            where: { [fieldName]: value }
                        });
                    } else if (models[req.baseUrl.substring(1)] && models[req.baseUrl.substring(1)].rawAttributes[key]) {
                        // Filtering on the primary model's field
                        queryOptions.where[key] = value;
                    }
                }
            }
    
            // Handle sorting
            if (req.query.sort) {
                let sortOrder = req.query.sort[0] === '-' ? 'DESC' : 'ASC';
                let sortField = sortOrder === 'DESC' ? req.query.sort.slice(1) : req.query.sort;
                queryOptions.order.push([sortField, sortOrder]);
            }
    
            req.queryOptions = queryOptions;
            next();
        };
    }
    
    

/**
 * @swagger
 * /get_scores:
 *   get:
 *     summary: Retrieve all scores
 *     tags: [Score]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter scores
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Score'
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_scores", queryParser(models), async (req, res) => {
    try {
        const scores = await models.Score.findAll(req.queryOptions);
        res.send(scores);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving scores." });
    }
});



/**
 * @swagger
 * /get_score/{id}:
 *   get:
 *     summary: Retrieve a single score by ID
 *     tags: [Score]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the score
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Score'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_score/:id", async (req, res) => {
  const id = req.params.id;
  try {
      const score = await models.Score.findByPk(id);
      score ? res.send(score) : res.status(404).send({ message: `Not found Score with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving the Score." });
  }
});

/**
 * @swagger
 * /create_score:
 *   post:
 *     summary: Create a new score
 *     tags: [Score]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Score'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Score'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
*     security:
*       - Authorization: []
 */

router.post("/create_score", authenticateToken, async (req, res) => {
  try {
      const score = await models.Score.create({ ...req.body, createdAt: nowTime });
      res.status(201).send(score);
  } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while creating the Score." });
  }
});

/**
 * @swagger
 * /update_score/{id}:
 *   put:
 *     tags:
 *       - Score
 *     summary: "Update an score by ID"
 *     description: "This endpoint updates an existing score's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the score to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "Score data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Score"
 *     responses:
 *       200:
 *         description: "Score updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Score"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "Score not found"
 *       500:
 *         description: "Error updating score"
*     security:
*       - Authorization: []
 */
router.put("/update_score/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
      const updated = await models.Score.update({ ...req.body, updatedAt: nowTime }, { where: { id } });
      updated[0] ? res.send(await models.Score.findByPk(id)) : res.status(404).send({ message: `Not found Score with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: `Error updating Score with id ${id}` });
  }
});

/**
 * @swagger
 * /delete_score/{id}:
 *   delete:
 *     summary: Delete an score by its ID
 *     tags: [Score]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the score to delete
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Score deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the successful deletion
 *                   example: Score was deleted successfully!
 *       404:
 *         description: Score not found
 *       500:
 *         description: Internal server error
*     security:
*       - Authorization: []
 */
router.delete("/delete_score/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
      const deleted = await models.Score.destroy({ where: { id } });
      deleted ? res.status(200).send({ message: `Score with id ${id} was deleted successfully!` }) : res.status(404).send({ message: `Not found Score with id ${id}.` });
  } catch (err) {
      res.status(500).send({ message: "Could not delete Score with id " + id });
  }
});

router.get('/student-scores', scoreController.getStudentScores);

module.exports = router;
