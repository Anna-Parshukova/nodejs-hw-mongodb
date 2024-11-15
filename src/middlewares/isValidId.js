import mongoose from 'mongoose';

export const isValidId = (req, res, next) => {
    const { _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({
            status: 400,
            message: `Invalid ID: ${_id}`,
        });
    }
    next();
};
