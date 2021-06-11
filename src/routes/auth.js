const express = require("express");
const { signup, signin } = require("../controller/auth");
const {
  vailidateSignupRequest,
  vailidateSigninRequest,
  isRequestVailidated,
} = require("../vailidators/auth");
const router = express.Router();

router.post("/signup", vailidateSignupRequest, isRequestVailidated, signup);
router.post("/signin", vailidateSigninRequest, isRequestVailidated, signin);
// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({
//     message: "profile",
//     user: req.user,
//   });
// });
module.exports = router;
