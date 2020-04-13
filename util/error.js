
'use strict';
// Helper Functions
function errorHandler(error, response) {
    console.log(error);
    response.status(500).json({
      error: true,
      message: error.message,
    });
  }

  module.exports = errorHandler;