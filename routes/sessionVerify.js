const verifySession = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        return res.status(401).json('You are not logged in');
    }
}

module.exports = {verifySession};