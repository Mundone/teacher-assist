const success = (res, data, message = "Амжилттай") => {
  return res.status(200).json({ message, data });
};

const created = (res, data, message = "Амжилттай үүслээ") => {
  return res.status(201).json({ message, data });
};

const updated = (res, data, message = "Амжилттай шинэчэллээ") => {
  return res.status(200).json({ message, data });
};

const deleted = (res, data, message = "Амжилттай устгалаа") => {
  return res.status(200).json({ message, data });
};

const badRequest = (res, error, message = "Bad Request") => {
  return res.status(400).json({
    error: message,
    message: error.message
  });
};

const unauthorized = (res, message = "Токен ирүүлээгүй байна.") => {
  return res.status(401).json({ message });
};

const forbidden = (res, error, message = "Зөвшөөрөлгүй хандалт") => {
  return res.status(403).json({
    error: message,
    message: error.message
  });
};

const notFound = (res, message = "Олдсонгүй") => {
  return res.status(404).json({ message });
};

const conflict = (res, message = "Зөрчил үүслээ") => {
  return res.status(409).json({ message });
};

const unprocessableEntity = (res, message = "Unprocessable Entity") => {
  return res.status(422).json({ message });
};

const internalServerError = (res, error, message = 'Backend-ын алдаа. Мөнх-Очиртой холбогдоно уу') => {
    console.error(message, error);
  
    let responseMessage = message;
    let errorCode = 'INTERNAL_SERVER_ERROR';
  
    if (error.name === 'SequelizeValidationError') {
      responseMessage = 'Validation Error';
      errorCode = 'VALIDATION_ERROR';
    } else if (error.type === 'custom') {
      responseMessage = error.message
      errorCode = error.code || 'CUSTOM_ERROR';
    }
    return res.status(500).json({
      error: responseMessage,
      code: errorCode,
      detail: error.message
    });
  };
  

module.exports = {
  success,
  created,
  updated,
  deleted,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessableEntity,
  internalServerError,
};
