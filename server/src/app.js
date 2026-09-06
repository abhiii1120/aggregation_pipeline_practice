import express from 'express'

let app = express();

app.use(express.json());


app.use((req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;

    res.status(statusCode).json({
        message: error.message || 'Internal Server Error',
    });
});


export default app;