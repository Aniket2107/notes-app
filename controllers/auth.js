const bcrypt = require("bcrypt");
const User = require("../models/User");

// utils and helpers
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../helpers/auth");

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser?._id);
    const refreshToken = generateRefreshToken(newUser?._id);

    res.status(201).json({ user: newUser, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user?._id);
    const refreshToken = generateRefreshToken(user?._id);

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const accessToken = generateAccessToken(user?._id);

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid refresh token." });
  }
};
