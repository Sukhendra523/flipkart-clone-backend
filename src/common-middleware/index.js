const jwt = require("jsonwebtoken");

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
  } else {
    return res.status(400).json({ message: "Signin required" });
  }
  next();
};


// exports.requireSignin = (req, res, next) => {
//   if (req.headers.authorization) {
//     const token = req.headers.authorization.split(" ")[1];
//     const user = jwt.verify(token, process.env.SECRET_KEY);
//     if(!user){
//       return res.status(500).json({ message: "Invalid Token" });
//     }
//     req.user = user;
//   } else {
//     return res.status(400).json({ message: "Signin required" });
//   }
//   next();
// };

exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(400).json({ message: "User Acces denied" });
  }
  next();
};

exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(400).json({ message: "Admin Acces denied" });
  }
  next();
};
