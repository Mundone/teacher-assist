const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Teacher-Journal API",
      version: "1.0.0",
      description: "API for Teacher-Journal",
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          value: "Bearer <JWT token here>",
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      schemas: {
        Assignment: {
          type: "object",
          required: ["subject_id", "max_score", "assignment_number"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the Assignment." },
            subject_id: { type: "integer", description: "ID of the Subject." },
            max_score: { type: "integer", description: "Maximum score for the assignment." },
            assignment_number: { type: "integer", description: "Number of the assignment." },
          },
          example: {
            id: 1,
            subject_id: 5,
            max_score: 100,
            assignment_number: 1,
          },
        },
        AttendanceRecord: {
          type: "object",
          required: ["student_id", "subject_id", "lecture_schedule_id", "attendance_date", "attended"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the Attendance Record." },
            student_id: { type: "integer", description: "ID of the Student." },
            subject_id: { type: "integer", description: "ID of the Subject." },
            lecture_schedule_id: { type: "integer", description: "ID of the Lecture Schedule." },
            attendance_date: { type: "string", format: "date", description: "Date of attendance." },
            attended: { type: "boolean", description: "Whether the student attended the lecture." },
          },
          example: {
            id: 1,
            student_id: 101,
            subject_id: 5,
            lecture_schedule_id: 3,
            attendance_date: "2024-01-21",
            attended: true,
          },
        },
        Lab: {
          type: "object",
          required: ["subject_id", "lab_day", "lab_time", "max_score", "lab_number"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the Lab." },
            subject_id: { type: "integer", description: "ID of the Subject." },
            lab_day: { type: "integer", description: "Day of the lab." },
            lab_time: { type: "integer", description: "Time of the lab." },
            max_score: { type: "integer", description: "Maximum score for the lab." },
            lab_number: { type: "integer", description: "Number of the lab." },
          },
          example: {
            id: 1,
            subject_id: 5,
            lab_day: 3,
            lab_time: 14,
            max_score: 50,
            lab_number: 2,
          },
        },
        LectureSchedule: {
          type: "object",
          required: ["subject_id", "lecture_day", "lecture_time"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the Lecture Schedule." },
            subject_id: { type: "integer", description: "ID of the Subject." },
            lecture_day: { type: "integer", description: "Day of the lecture." },
            lecture_time: { type: "integer", description: "Time of the lecture." },
          },
          example: {
            id: 1,
            subject_id: 5,
            lecture_day: 2,
            lecture_time: 10,
          },
        },
        Score: {
          type: "object",
          required: ["student_id", "subject_id", "lecture_scores", "lab_scores", "lab_attendance_scores", "assignment_scores", "extra_point"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the Score." },
            student_id: { type: "integer", description: "ID of the Student." },
            subject_id: { type: "integer", description: "ID of the Subject." },
            lecture_scores: { type: "json", description: "JSON of lecture scores." },
            lab_scores: { type: "json", description: "JSON of lab scores." },
            lab_attendance_scores: { type: "json", description: "JSON of lab attendance scores." },
            assignment_scores: { type: "json", description: "JSON of assignment scores." },
            extra_point: { type: "integer", description: "Extra points." },
          },
          example: {
            id: 1,
            student_id: 101,
            subject_id: 5,
            lecture_scores: "{...}",
            lab_scores: "{...}",
            lab_attendance_scores: "{...}",
            assignment_scores: "{...}",
            extra_point: 5,
          },
        },
        Student: {
          type: "object",
          required: ["name", "student_code"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the Student." },
            name: { type: "string", description: "Name of the Student." },
            student_code: { type: "string", description: "Unique code for the Student." },
          },
          example: {
            id: 101,
            name: "John Doe",
            student_code: "S001",
          },
        },
        StudentEnrollment: {
          type: "object",
          required: ["student_id", "subject_id", "lecture_schedule_id"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the Student Enrollment." },
            student_id: { type: "integer", description: "ID of the Student." },
            subject_id: { type: "integer", description: "ID of the Subject." },
            lecture_schedule_id: { type: "integer", description: "ID of the Lecture Schedule." },
          },
          example: {
            id: 10,
            student_id: 101,
            subject_id: 5,
            lecture_schedule_id: 3,
          },
        },
        Subject: {
          type: "object",
          required: ["subject_name", "teacher_id"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the Subject." },
            subject_name: { type: "string", description: "Name of the Subject." },
            teacher_id: { type: "integer", description: "ID of the Teacher." },
          },
          example: {
            id: 5,
            subject_name: "Mathematics",
            teacher_id: 202,
          },
        },
        Teacher: {
          type: "object",
          required: ["name", "code", "role_id", "password"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the Teacher." },
            name: { type: "string", description: "Name of the Teacher." },
            code: { type: "string", description: "Unique code for the Teacher." },
            role_id: { type: "integer", description: "ID of the Teacher's Role." },
            password: { type: "string", description: "Password for the Teacher." },
          },
          example: {
            id: 202,
            name: "Jane Smith",
            code: "T001",
            role_id: 1,
            password: "pass1234",
          },
        },
        TeacherFile: {
          type: "object",
          required: ["teacher_id", "file_name", "file_path", "file_type", "upload_date"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the Teacher File." },
            teacher_id: { type: "integer", description: "ID of the Teacher." },
            file_name: { type: "string", description: "Name of the file." },
            file_path: { type: "string", description: "Path of the file." },
            file_type: { type: "string", description: "Type of the file." },
            upload_date: { type: "string", format: "date-time", description: "Upload date of the file." },
          },
          example: {
            id: 33,
            teacher_id: 202,
            file_name: "lecture.pdf",
            file_path: "/files/lecture.pdf",
            file_type: "pdf",
            upload_date: "2024-01-25T08:30:00Z",
          },
        },
        TeacherRole: {
          type: "object",
          required: ["role_name"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the Teacher Role." },
            role_name: { type: "string", description: "Name of the Teacher Role." },
          },
          example: {
            id: 1,
            role_name: "Math Teacher",
          },
        },

        Login: {
          type: "object",
          required: ["code", "password"], // assuming these are required fields
          properties: {
            code: {
              type: "integer",
              description: "Code of a user.",
            },
            password: {
              type: "string",
              description: "Password of a user.",
            },
          },
          example: {
            email: "B200910045",
            password: "Password",
          },
        },

        Register: {
          type: "object",
          required: ["code", "name", "password"], // assuming these are required fields
          properties: {
            code: {
              type: "integer",
              description: "Code of a new user.",
            },
            name: {
              type: "string",
              description: "Name of a new user.",
            },
            password: {
              type: "string",
              description: "Password of a new user.",
            },
          },
          example: {
            email: "bataa@yahoo.com",
            name: "Bataa",
            password: "Password",
          },
        },
        // Define other models (Assignment, Lab, LectureSchedule, Score, etc.) following the same pattern
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // Path to the API docs (your route files)
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
