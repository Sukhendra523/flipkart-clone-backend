const express = require("express");
const { requireSignin } = require("../../common-middleware");
const { getInitialData } = require("../../controller/admin/initialData");

const router = express.Router();

router.get("/initialData", getInitialData);

module.exports = router;
