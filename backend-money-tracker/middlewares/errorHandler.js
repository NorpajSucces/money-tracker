const errorHandler = (err, req, res, next) => {
    // Log error di development untuk memudahkan debugging
    console.error(`[${new Date().toISOString()}] ${err.name || 'Error'}:`, err.message);

    let status = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.name === 'ValidationError') {
        status = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    } else if (err.name === 'CastError') {
        status = 400;
        message = `Invalid ID format: ${err.value}`;
    } else if (err.name === 'InvalidLogin') {
        status = 401;
        message = 'Invalid username or password';
    } else if (err.name === 'Unauthorized' || err.name === 'JsonWebTokenError') {
        status = 401;
        message = 'Unauthorized. Please login first!';
    } else if (err.name === 'TokenExpiredError') {
        status = 401;
        message = 'Session expired. Please login again.';
    } else if (err.code === 11000) {
        status = 400;
        message = 'Username is already taken';
    }

    res.status(status).json({
        success: false,
        error: message
    });
};

module.exports = errorHandler;
