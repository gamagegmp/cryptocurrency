const express = require("express");
const {
  register,
  login,
  addSelectedCrypto,
  removeSelectedCrypto,
} = require("../controllers/userController");
const authenticate = require("../middleware/authenticate.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User registration, login, and crypto selection
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 email: "user@example.com"
 *                 username: "username"
 *               token: "jsonwebtoken"
 *       400:
 *         description: User already registered or password mismatch
 *         content:
 *           application/json:
 *             example:
 *               message: |
 *                    User already registered
 *                    or
 *                    Password does not match
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */
router.post("/register", register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       description: User login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 email: "user@example.com"
 *                 username: "username"
 *               token: "jsonwebtoken"
 *       400:
 *         description: User not found or password incorrect
 *         content:
 *           application/json:
 *             example:
 *               message: |
 *                      User not found
 *                      or
 *                      Password incorrect
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
router.post("/login", login);

/**
 * @swagger
 * /user/addSelectedCrypto/{userId}:
 *   post:
 *     summary: Add a cryptocurrency to the user's selected list
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Crypto name to add to selected
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cryptoName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Crypto added to selected successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Crypto added to selected"
 *               user:
 *                 email: "user@example.com"
 *                 username: "username"
 *                 selectedCryptos: ["BTC", "ETH"]
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             example:
 *               error: "Authentication failed"
 *       403:
 *         description: Unauthorized access or access denied
 *         content:
 *           application/json:
 *             example:
 *               error: |
 *                    Unauthorized access
 *                    or
 *                    Access denied
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */
router.post("/addSelectedCrypto/:userId", authenticate, addSelectedCrypto);

/**
 * @swagger
 * /user/removeSelectedCrypto/{userId}:
 *   post:
 *     summary: Remove a cryptocurrency from the user's selected list
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Crypto name to remove from selected
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cryptoName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Crypto removed from selected successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Crypto removed from selected"
 *               user:
 *                 email: "user@example.com"
 *                 username: "username"
 *                 selectedCryptos: ["ETH"]
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             example:
 *               error: "Authentication failed"
 *       403:
 *         description: Unauthorized access or access denied
 *         content:
 *           application/json:
 *             example:
 *               error: |
 *                  Unauthorized access
 *                  or
 *                  Access denied
 *       404:
 *         description: User not found or crypto not found in selected
 *         content:
 *           application/json:
 *             example:
 *               error: |
 *                    User not found
 *                    or
 *                    Crypto not found in selected
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */
router.post(
  "/removeSelectedCrypto/:userId",
  authenticate,
  removeSelectedCrypto
);

module.exports = router;
