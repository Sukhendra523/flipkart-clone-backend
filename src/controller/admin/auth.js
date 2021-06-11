const User = require("../../models/user");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) {
      return res.status(400).json({
        error,
      });
    }
    if (user) {
      if (user.authenticate(req.body.password) && user.role == "admin") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("token", token);
        const { firstName, lastName, email, role, fullName } = user;
        res.status(200).json({
          token,
          user: {
            firstName,
            lastName,
            email,
            role,
            fullName,
          },
        });
      } else {
        res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({
        message: "Somthing went wrong",
      });
    }
  });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user) {
      return res.status(400).json({
        message: "Admin already exits",
      });
    }
    if (error) {
      console.log(error);
    }
    const { firstName, lastName, email, password } = req.body;
    const _user = new User({
      firstName,
      lastName,
      email,
      password,
      username: shortid.generate(),
      role: "admin",
    });
    _user.save((error, data) => {
      if (error) {
        res.status(400).json({
          message: "somthing goes wrong",
        });
      }
      if (data) {
        res.status(201).json({
          message: "Admin created Succefully",
        });
      }
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Admin Signout succesfuly",
  });
};
