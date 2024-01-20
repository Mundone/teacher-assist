const swaggerJSDoc = require("swagger-jsdoc");

// Options for the swagger docs
const options = {
  definition: {
    openapi: "3.0.0", // or your OpenAPI version
    info: {
      title: "Teacher-Journal API",
      version: "1.0.0",
      description: "API for Teacher-Journal",
      // additional info fields
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
        AttendanceRecord: {
          type: "object",
          required: ["StudentID", "SubjectID", "LectureScheduleID", "AttendanceDate", "Attended"],
          properties: {
            AttendanceID: { type: "integer", description: "Unique identifier for the Attendance Record." },
            StudentID: { type: "integer", description: "ID of the Student." },
            SubjectID: { type: "integer", description: "ID of the Subject." },
            LectureScheduleID: { type: "integer", description: "ID of the Lecture Schedule." },
            AttendanceDate: { type: "string", format: "date", description: "Date of attendance." },
            Attended: { type: "boolean", description: "Whether the student attended the lecture." },
          },
          example: {
            AttendanceID: 1,
            StudentID: 101,
            SubjectID: 5,
            LectureScheduleID: 3,
            AttendanceDate: "2024-01-21",
            Attended: true,
          },
        },

        LabSchedule: {
          type: "object",
          required: ["SubjectID", "LabDay", "LabTime"],
          properties: {
            ScheduleID: { type: "integer", description: "Unique identifier for the Lab Schedule." },
            SubjectID: { type: "integer", description: "ID of the Subject." },
            LabDay: { type: "integer", description: "Day of the lab." },
            LabTime: { type: "integer", description: "Time of the lab." },
          },
          example: {
            ScheduleID: 1,
            SubjectID: 10,
            LabDay: 2, // Assuming 2 means 'Tuesday'
            LabTime: 14, // Assuming 14 means '2 PM'
          },
        },

        LectureSchedule: {
          type: "object",
          required: ["SubjectID", "LectureDay", "LectureTime"],
          properties: {
            ScheduleID: { type: "integer", description: "Unique identifier for the Lecture Schedule." },
            SubjectID: { type: "integer", description: "ID of the Subject." },
            LectureDay: { type: "integer", description: "Day of the lecture." },
            LectureTime: { type: "integer", description: "Time of the lecture." },
          },
          example: {
            ScheduleID: 2,
            SubjectID: 11,
            LectureDay: 3, // Assuming 3 means 'Wednesday'
            LectureTime: 10, // Assuming 10 means '10 AM'
          },
        },

        Teacher: {
          type: "object",
          required: ["Name", "RoleID"],
          properties: {
            TeacherID: { type: "integer", description: "Unique identifier for the Teacher." },
            Name: { type: "string", description: "Name of the Teacher." },
            RoleID: { type: "integer", description: "Role ID of the Teacher." },
          },
          example: {
            TeacherID: 1,
            Name: "Jane Doe",
            RoleID: 2,
          },
        },

        TeacherRole: {
          type: "object",
          properties: {
            RoleID: { type: "integer", description: "Unique identifier for the Teacher Role." },
            RoleName: { type: "string", description: "Name of the role." },
          },
          example: {
            RoleID: 2,
            RoleName: "Senior Lecturer",
          },
        },

        Score: {
          type: "object",
          required: ["StudentID", "SubjectID", "LectureScores", "LabScores", "LabAttendanceScores", "AssignmentScores", "ExtraPoint"],
          properties: {
            ScoreID: { type: "integer", description: "Unique identifier for the Score." },
            StudentID: { type: "integer", description: "ID of the Student." },
            SubjectID: { type: "integer", description: "ID of the Subject." },
            LectureScores: { type: "object", additionalProperties: { type: "integer" }, description: "Scores in lectures." },
            LabScores: { type: "object", additionalProperties: { type: "integer" }, description: "Scores in labs." },
            LabAttendanceScores: { type: "object", additionalProperties: { type: "integer" }, description: "Scores for lab attendance." },
            AssignmentScores: { type: "object", additionalProperties: { type: "integer" }, description: "Scores for assignments." },
            ExtraPoint: { type: "integer", description: "Extra points." },
          },
          example: {
            ScoreID: 1,
            StudentID: 101,
            SubjectID: 5,
            LectureScores: { week1: 80, week2: 85 },
            LabScores: { week1: 90, week2: 95 },
            LabAttendanceScores: { week1: 10, week2: 10 },
            AssignmentScores: { assignment1: 75, assignment2: 80 },
            ExtraPoint: 5,
          },
        },

        Student: {
          type: "object",
          required: ["Name", "StudentCode"],
          properties: {
            StudentID: {
              type: "integer",
              description: "Unique identifier for the Student.",
            },
            Name: {
              type: "string",
              description: "Name of the Student.",
            },
            StudentCode: {
              type: "string",
              description: "Code of the Student.",
            },
          },
          example: {
            StudentID: 1,
            Name: "John Doe",
            StudentCode: "S123456",
          },
        },

        StudentEnrollment: {
          type: "object",
          required: ["StudentID", "SubjectID", "LectureScheduleID", "LabScheduleID"],
          properties: {
            EnrollmentID: { type: "integer", description: "Unique identifier for the Student Enrollment." },
            StudentID: { type: "integer", description: "ID of the Student." },
            SubjectID: { type: "integer", description: "ID of the Subject." },
            LectureScheduleID: { type: "integer", description: "ID of the Lecture Schedule." },
            LabScheduleID: { type: "integer", description: "ID of the Lab Schedule." },
          },
          example: {
            EnrollmentID: 1,
            StudentID: 101,
            SubjectID: 5,
            LectureScheduleID: 3,
            LabScheduleID: 2,
          },
        },

        Subject: {
          type: "object",
          required: ["SubjectName", "TeacherID"],
          properties: {
            SubjectID: {
              type: "integer",
              description: "Unique identifier for the Subject.",
            },
            SubjectName: {
              type: "string",
              description: "Name of the Subject.",
            },
            TeacherID: {
              type: "integer",
              description: "ID of the Teacher associated with the Subject.",
            },
          },
          example: {
            SubjectID: 1,
            SubjectName: "Mathematics",
            TeacherID: 2,
          },
        },

        Login: {
          type: "object",
          required: ["name"], // assuming these are required fields
          properties: {
            email: {
              type: "integer",
              description: "Email of a new user.",
            },
            password: {
              type: "string",
              description: "Password of a new user.",
            },
          },
          example: {
            email: "bataa@yahoo.com",
            password: "Password",
          },
        },
        
        Register: {
          type: "object",
          required: ["email", "name", "password"], // assuming these are required fields
          properties: {
            email: {
              type: "integer",
              description: "Email of a new user.",
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
        // You can define other schemas here...
      },
      // other component definitions (e.g., securitySchemes, requestBodies, etc.)
    },
  },
  apis: ["./routes/*.js"], // Path to the API docs (your route files)
};

// Initialize swagger-jsdoc -> returns validated swagger spec in JSON format
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
