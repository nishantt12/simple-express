'use-strict';

var response;

response = {

  successResponse: function successResponse(res, data, statusCode) {
    return res.status(statusCode || 200).json({
      isError: false,
      data: data,
      message: 'Successfully Done!!'
      
    });
  },


    successResponseUserExists: function successResponseUserExists(res, data, statusCode) {
    return res.status(statusCode || 200).json( {
      isError: false,
      new_user: false, 
      success: {
        data: data,
        message: 'Successfully Done!!'
      }
    });
  },

  errorResponse: function errorResponse(res, err, statusCode, message) {
    return res.status(statusCode || 200).json( {
      isError: true,
      error: message || err.message,
      success: message || err.message
    });
  }

}

module.exports = response;
