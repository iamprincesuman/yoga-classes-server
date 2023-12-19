module.exports = (res, status, message) => {
    // console.error(message);
    res.status(status).json({ error: message });
};