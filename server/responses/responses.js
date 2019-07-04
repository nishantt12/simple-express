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
    return res.status(statusCode || 200).json({
      isError: false,
      new_user: false,
      success: {
        data: data,
        message: 'Successfully Done!!'
      }
    });
  },

  errorResponse: function errorResponse(res, err, statusCode, message) {
    console.log("err: "+message);
    var error;
    if (typeof message === 'string' || message instanceof String) {
      error = message;
    }
    else if ('message' in message) {
      error = message.message;
    }
    else {
      error = message;
    }

    console.log("err1: "+error);
    return res.status(statusCode || 200).json({
      isError: true,
      error: error || err.message,
      success: message || err.message
    });
  }

}

module.exports = response;
