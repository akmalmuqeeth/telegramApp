module.exports = function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    res.status(403).end();
  }
};