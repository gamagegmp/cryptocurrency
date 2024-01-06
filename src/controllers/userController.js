const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const register = async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: "user already registered" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "password does not match" });
    }

    const user = await User.create({ email, username, password });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET,
      { expiresIn: "10h" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(400).json({ message: "user not found" });
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password);

    if (!checkPassword) {
      return res.status(400).json({ message: "password incorrect" });
    }

    const token = jwt.sign(
      { email: checkUser.email, id: checkUser._id },
      process.env.SECRET,
      { expiresIn: "10h" }
    );
    res.status(200).json({ checkUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSelectedCrypto = async (req, res) => {
  const { userId } = req.params;
  const { cryptoName } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (user.selectedCryptos.includes(cryptoName)) {
      return res.status(400).json({ error: "Crypto already in selected" });
    }

    user.selectedCryptos.push(cryptoName);

    await user.save();

    res.status(200).json({ message: "Crypto added to selected", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeSelectedCrypto = async (req, res) => {
  const { userId } = req.params;
  const { cryptoName } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const cryptoIndex = user.selectedCryptos.indexOf(cryptoName);

    if (cryptoIndex === -1) {
      return res.status(404).json({ error: "Crypto not found in selected" });
    }

    user.selectedCryptos.splice(cryptoIndex, 1);

    await user.save();

    res.status(200).json({ message: "Crypto removed from selected", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { register, login, addSelectedCrypto, removeSelectedCrypto };
