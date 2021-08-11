const User = require("../models/user");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) {
      return res.status(400).json({
        error,
      });
    }
    if (user) {
      if (user.authenticate(req.body.password)) {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
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
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({
        message: "Email already exits",
      });
    }
    if (error) {
      console.log(error);
    }
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const _user = new User({
      firstName,
      lastName,
      email,
      hashPassword,
      username: shortid.generate(),
    });
    _user.save((error, data) => {
      if (error) {
        res.status(400).json({
          message: "somthing goes wrong",
        });
      }
      if (data) {
        res.status(201).json({
          message: "User created Succefully",
        });
      }
    });
  });
};
