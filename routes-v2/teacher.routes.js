const { sequelize, DataTypes } = require("../db"),
  bcrypt = require("bcryptjs"),
  { Teacher, teacherRole, EducationCenter, nowTime } = require("../models/models")(
    sequelize,
    DataTypes
  ),
  router = require("express").Router(),
  { authenticateToken, validatePassword } = require("./auth.routes"),
  upload = require("../config/upload-config"),
  { s3, getSignedUrl, bucketName } = require("../config/aws.config"),
  { DeleteObjectCommand } = require("@aws-sdk/client-s3");

const sendError = (res, err) =>
  res.status(500).send({ message: err.message || "An error occurred." });

/**
 * @swagger
 * /get_teachers:
 *   get:
 *     summary: Retrieve all teachers
 *     tags: [Teacher]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search term to filter teachers
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_teachers", authenticateToken, async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [teacherRole, EducationCenter],
      attributes: {
        include: [
          [sequelize.col("teacherRole.roleName"), "teacherRoleName"],
          [sequelize.col("EducationCenter.name"), "educationCenterName"],
        ],
      },
      ...(req.query.search && {
        where: {
          name: { [sequelize.Op.like]: `%${req.query.search.toLowerCase()}%` },
        },
      }),
    });
    res.send(teachers);
  } catch (err) {
    sendError(res, err);
  }
});

/**
 * @swagger
 * /get_teacher/{id}:
 *   get:
 *     summary: Retrieve a single teacher by ID
 *     tags: [Teacher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the teacher
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_teacher/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const teacher = await Teacher.findByPk(id);
    teacher
      ? res.send(teacher)
      : res.status(404).send({ message: `Not found Teacher with id ${id}.` });
  } catch (err) {
    sendError(res, err);
  }
});

/**
 * @swagger
 * /create_teacher:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teacher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post(
  "/create_teacher",
  authenticateToken,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Check if the email already exists
      const existingTeacher = await Teacher.findOne({ where: { email } });
      if (existingTeacher) {
        return res.status(409).send({ message: "Email already in use." });
      }

      // Validate the password
      const passwordError = validatePassword(password);
      if (passwordError) {
        return res.status(400).send({ message: passwordError });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the teacher
      const teacher = await Teacher.create({
        ...req.body,
        password: hashedPassword,
        profileImage: req.file?.location,
        createdAt: nowTime,
      });

      // Exclude the password from the response
      const { password: teacherPassword, ...teacherInfoWithoutPassword } =
        teacher.toJSON();
      res.status(201).send(teacherInfoWithoutPassword);
    } catch (err) {
      sendError(res, err);
    }
  }
);

/**
 * @swagger
 * /update_teacher/{id}:
 *   put:
 *     tags: [Teacher]
 *     summary: Update a teacher by ID
 *     description: Updates an existing teacher's information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Teacher data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Error updating teacher
 *     security:
 *       - Authorization: []
 */

router.put(
  "/update_teacher/:id",
  authenticateToken,
  upload.single("profileImage"),
  async (req, res) => {
    const id = req.params.id;
    try {
      const teacher = await Teacher.findByPk(id);
      if (!teacher)
        return res
          .status(404)
          .send({ message: `Not found Teacher with id ${id}.` });
      if (req.file && teacher.profileImage)
        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: new URL(teacher.profileImage).pathname.substring(1),
          })
        );
      await Teacher.update(
        {
          ...req.body,
          profileImage: req.file?.location || teacher.profileImage,
          updatedAt: nowTime,
        },
        { where: { id: id } }
      );
      res.send(await Teacher.findByPk(id));
    } catch (err) {
      sendError(res, err);
    }
  }
);

/**
 * @swagger
 * /delete_teacher/{id}:
 *   delete:
 *     summary: Delete a teacher by its ID
 *     tags: [Teacher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete("/delete_teacher/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher)
      return res.status(404).send({ message: `Not found Teacher with id ${id}.` });
    if (teacher.profileImage)
      await s3.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: new URL(teacher.profileImage).pathname.substring(1),
        })
      );
    await Teacher.destroy({ where: { id: id } });
    res
      .status(200)
      .send({ message: `Teacher with id ${id} was deleted successfully!` });
  } catch (err) {
    sendError(res, err);
  }
});

module.exports = router;
