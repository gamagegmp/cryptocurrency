const express = require("express");
const {
  getAllCryptos,
  addCrypto,
  deleteCrypto,
  getCryptoByName,
} = require("../controllers/cryptoController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Crypto
 *   description: Cryptocurrency data and management
 */

/**
 * @swagger
 * /crypto:
 *   get:
 *     summary: Get all cryptocurrencies
 *     tags: [Crypto]
 *     responses:
 *       200:
 *         description: List of cryptocurrencies
 *         content:
 *           application/json:
 *             example:
 *               cryptos: [{name: "BTC", logo: "logo_url", price: 50000}, {name: "ETH", logo: "logo_url", price: 3000}]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */
router.get("/", getAllCryptos);

/**
 * @swagger
 * /crypto/name:
 *   get:
 *     summary: Get cryptocurrency by name
 *     tags: [Crypto]
 *     requestBody:
 *       description: Crypto name
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cryptocurrency details
 *         content:
 *           application/json:
 *             example:
 *               currentCrypto: {name: "BTC", logo: "logo_url", price: 50000}
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */
router.get("/name/", getCryptoByName);

/**
 * @swagger
 * /crypto:
 *   post:
 *     summary: Add a new cryptocurrency
 *     tags: [Crypto]
 *     requestBody:
 *       description: Crypto name
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: New cryptocurrency added successfully
 *         content:
 *           application/json:
 *             example:
 *               newCryptocurrency:
 *                 name: "BTC"
 *                 logo: "logo_url"
 *                 price: 50000
 *       400:
 *         description: Crypto already exists or invalid cryptocurrency name
 *         content:
 *           application/json:
 *             example:
 *               message: |
 *                    Crypto already exists
 *                    or
 *                    Check name again
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */
router.post("/", addCrypto);

/**
 * @swagger
 * /crypto/{id}:
 *   delete:
 *     summary: Delete a cryptocurrency by ID
 *     tags: [Crypto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cryptocurrency
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cryptocurrency deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Cryptocurrency deleted successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */
router.delete("/:id", deleteCrypto);

module.exports = router;
