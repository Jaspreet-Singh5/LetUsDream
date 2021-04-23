var middleware = {};

// middleware to prevent unauthenticated access
middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated() && req.user.isAdmin){
            return next();
    }
    res.redirect("/login");
};

module.exports = middleware;