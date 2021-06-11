const express = require("express");
const { requireSignin, userMiddleware } = require("../common-middleware");
const { addToCart } = require("../controller/cart");
const router = express.Router();

router.post("/user/cart/addtocart", requireSignin, userMiddleware, addToCart);

// router.get("/cart/getCategories", getCategories);

module.exports = router;
