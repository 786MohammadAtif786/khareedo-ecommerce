const authService = require('../services/authService');


exports.register = async (req, res) => {
  try {
    const { user, token, restored } = await authService.register(req.body);
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: restored
        ? "Account restored successfully"
        : "User registered successfully",
      data: { user, token },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    user.password = undefined;
    res.json({ success: true, data: { user, token } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  const user = req.user.toObject();
  delete user.password;
  res.json({ success: true, data: user });
};


exports.update = async (req, res) => {
  try {
    const user = await authService.updateUser(req.user._id, req.body);
    user.password = undefined;
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


exports.softDelete = async (req, res) => {
  try {
    await authService.softDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ success: true, message: 'Reset email sent if account exists' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};