const errorHandler = (error, req, res, next) => {
    const statusCode = error.statuscode || 500;
    const message = error.message || "Something went wrong";
  
    return res.status(statusCode).json({
      success: false,
      message: message,
    });
  };
  
  module.exports = errorHandler;
  