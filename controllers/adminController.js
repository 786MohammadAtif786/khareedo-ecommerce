const adminService = require("../services/adminService");

exports.promoteToAdmin = async (req, res) => {
  try {
    const updatedUser = await adminService.makeAdmin(req.params.id);
    res.json({ success: true, message: "User promoted to Admin", data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.demoteToUser = async (req, res) => {
  try {
    const updatedUser = await adminService.removeAdmin(req.params.id);
    res.json({ success: true, message: "Admin removed, now User", data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
