const express = require("express");
const { requireSignin } = require("../../common-middleware");
const { signup, signin, signout } = require("../../controller/admin/auth");

const {
  vailidateSignupRequest,
  vailidateSigninRequest,
  isRequestVailidated,
} = require("../../vailidators/auth");

const router = express.Router();

router.post(
  "/admin/signup",
  vailidateSignupRequest,
  isRequestVailidated,
  signup
);

router.post(
  "/admin/signin",
  vailidateSigninRequest,
  isRequestVailidated,
  signin
);

router.post("/admin/signout", requireSignin, signout);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({
//     message: "profile",
//     user: req.user,
//   });
// });
module.exports = router;
