import { Request, Response, NextFunction } from 'express';

const ErrorTypes = {
    DATABASE: 'DATABASE_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    AUTHORIZATION: 'AUTHORIZATION_ERROR',
    NOT_FOUND: 'NOT_FOUND_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR'
};

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    let statusCode = 500;
    let errorType = ErrorTypes.UNKNOWN;
    let message = 'An unexpected error occurred';

    switch (err.name) {
        case 'ValidationError':
            statusCode = 400;
            errorType = ErrorTypes.VALIDATION;
            message = err.message || 'Invalid input data';
            break;
        case 'AuthorizationError':
            statusCode = 403;
            errorType = ErrorTypes.AUTHORIZATION;
            message = err.message || 'You are not authorized to perform this action';
            break;
        case 'NotFoundError':
            statusCode = 404;
            errorType = ErrorTypes.NOT_FOUND;
            message = err.message || 'Requested resource not found';
            break;
        case 'MongoError':
        case 'MongoServerError':
        case 'DatabaseError':
            statusCode = 500;
            errorType = ErrorTypes.DATABASE;
            message = err.message || 'A database error occurred';
            break;
    }

    res.status(statusCode).json({
        error: {
            type: errorType,
            message: message,
            ...(process.env.NODE_ENV === 'development' && { details: err.stack })
        }
    });
};

export { errorHandler, ErrorTypes };