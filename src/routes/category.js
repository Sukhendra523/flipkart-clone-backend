const express = require("express");


const { requireSignin, adminMiddleware, upload } = require("../common-middleware");
const { addCategory, getCategories, updateCategories, deleteCategories } = require("../controller/category");
const router = express.Router();


router.post(
  "/category/create",
  requireSignin,
  adminMiddleware,
  upload.single("image"),
  addCategory
);
router.get("/category/getCategories", getCategories);

router.post(
  "/category/update",
  requireSignin,
  adminMiddleware,
  upload.array("categoryImage"),
  updateCategories
);


router.post(
  "/category/delete",
  requireSignin,
  adminMiddleware,
  deleteCategories
);

module.exports = router;
