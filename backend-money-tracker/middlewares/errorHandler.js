const errorHandler = (err, req, res, next) => {
    // console.error(err.stack); // Uncomment to debug errors

    let status = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.name === 'ValidationError') {
        status = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    } else if (err.name === 'CastError') {
        status = 400;
        message = `ID format is invalid: ${err.value}`;
    } else if (err.name === 'InvalidLogin') {
        status = 401;
        message = 'Invalid username or password';
    } else if (err.name === 'Unauthorized' || err.name === 'JsonWebTokenError') {
        status = 401;
        message = 'You are unauthorized. Please login first!';
    } else if (err.code === 11000) { // Mongoose Unique Error (for register)
        status = 400;
        message = 'Username is already taken';
    }

    res.status(status).json({
        success: false,
        error: message,
    });
};

module.exports = errorHandler;
