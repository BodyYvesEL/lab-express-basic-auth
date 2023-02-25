
// Using custom middleware to check request

module.exports = function isLoggedIn(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    } else {
        next();
    }
};



