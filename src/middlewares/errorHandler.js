export const errorHandler = (error, req, res) => {
res.status(500).json({
    status: 500,
    message: "Something went wrong",
    data: error.message,
});
};
