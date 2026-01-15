const Admin = require("../models/Admin");

// Admin login
exports.adminLoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    } 
    
    if (admin.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    } 
    
    res.status(200).json({ success: true, message: "Admin login successful" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
