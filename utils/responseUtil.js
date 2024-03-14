const success = (res, data, message = "Амжилттай") => {
  return res.status(200).json({ message, data });
};

const created = (res, data, message = "Created") => {
  return res.status(201).json({ message, data });
};

const badRequest = (res, message = "Bad Request") => {
  return res.status(400).json({ message });
};

const unauthorized = (res, message = "Unauthorized") => {
  return res.status(401).json({ message });
};

const forbidden = (res, message = "Зөвшөөрөлгүй хандалт.") => {
  return res.status(403).json({ message });
};

const notFound = (res, message = "Олдсонгүй") => {
  return res.status(404).json({ message });
};

const conflict = (res, message = "Conflict") => {
  return res.status(409).json({ message });
};

const unprocessableEntity = (res, message = "Unprocessable Entity") => {
  return res.status(422).json({ message });
};

const internalServerError = (res, error, message = 'Internal Server Error') => {
    console.error(message, error);
  
    // Map known error types to user-friendly messages and codes
    let responseMessage = message;
    let errorCode = 'INTERNAL_SERVER_ERROR';
  
    // Example of handling different types of known errors
    if (error.name === 'SequelizeValidationError') {
      responseMessage = 'Validation Error';
      errorCode = 'VALIDATION_ERROR';
    } else if (error.type === 'custom') {
      responseMessage = error.message; // Custom error messages should be safe to expose
      errorCode = error.code || 'CUSTOM_ERROR';
    }
  
    // More error types can be added here as needed
  
    // Return a generic error structure
    return res.status(500).json({
      error: responseMessage,
      code: errorCode,
      detail: error.message // Consider the security implications of sending detailed error messages to the client
    });
  };
  

module.exports = {
  success,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessableEntity,
  internalServerError,
};
