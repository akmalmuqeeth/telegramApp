module.exports = function ensureAuthenticated(req, res, next){
  // logger.info("ensureAuthenticated");
  if(req.isAuthenticated()){
    next();
  } else {
    res.status(403).end();
  }
};