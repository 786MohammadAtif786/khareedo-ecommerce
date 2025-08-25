const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const adminController = require("../controllers/adminController");

router.put("/promote/:id", protect, authorize("superAdmin"), adminController.promoteToAdmin);
router.put("/demote/:id", protect, authorize("superAdmin"), adminController.demoteToUser);

module.exports = router;
