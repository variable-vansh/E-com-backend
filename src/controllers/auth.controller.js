const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userQueries } = require("../db/queries");

// Generate JWT token for admin
const generateToken = (userId) => {
  return jwt.sign({ userId, role: "ADMIN" }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Admin signup
const adminSignup = async (req, res) => {
  try {
    const { username, email, password, secretCode } = req.body;

    // Basic validation
    if (!username || !email || !password || !secretCode) {
      return res.status(400).json({
        success: false,
        message: "Username, email, password, and secret code are required",
      });
    }

    // Check secret code
    if (secretCode !== "9118087339") {
      return res.status(403).json({
        success: false,
        message: "Invalid secret code",
      });
    }

    // Check if admin already exists
    const existingUser = await userQueries.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const newAdmin = await userQueries.createUser({
      username,
      email,
      password: hashedPassword,
      role: "ADMIN",
    });

    // Generate token
    const token = generateToken(newAdmin.id);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
    });
  } catch (error) {
    console.error("Admin signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find admin user by username
    const user = await userQueries.getUserByUsername(username);
    if (!user || user.role !== "ADMIN") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  adminSignup,
  adminLogin,
};
