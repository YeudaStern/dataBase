const jwt = require("jsonwebtoken");


//Check if user logIn
exports.auth = (req, res, next) => {

  if(!req.session.user){
    return res.status(401).json({ msg: "You must log in" });
  }
  next();

}

//Check if user is 'admin'
exports.authAdmin = (req, res, next) => {

  if(req.session.user && req.session.user.role != "admin"){
    return res.status(401).json({ msg: "Just admin can be in this endpoint" });
  }
  next()
}


exports.authConstructor = (req, res, next) => {

  if(req.session.user && req.session.user.role != "constructor"){
    return res.status(401).json({ msg: "Just constructor can be in this endpoint" });
  }
  next()

}