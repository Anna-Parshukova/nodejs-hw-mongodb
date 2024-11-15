// import Joi from 'joi';

export const validateBody = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: `Validation error: ${error.message}`,
        });
    }
    next();
};
