const express = require("express");
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");

const { requireSignin, adminMiddleware } = require("../common-middleware");
const { addCategory, getCategories, updateCategories, deleteCategories } = require("../controller/category");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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
