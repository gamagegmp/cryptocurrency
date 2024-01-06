const axios = require("axios");
const Crypto = require("../models/Crypto.js");
const cron = require("node-cron");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchCurrentPrice = async (type) => {
  await delay(5000);

  try {
    const currentInfo = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${type}&x_cg_demo_api_key=CG-NV2P2osieCTjToyyNUzHmEZh`
    );
    return currentInfo.data;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find();

    res.status(200).json({ cryptos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCryptoByName = async (req, res) => {
  try {
    const name = req.body;

    const currentCrypto = await Crypto.findOne({ name });

    res.status(200).json({ currentCrypto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addCrypto = async (req, res) => {
  try {
    const { name } = req.body;

    const checkExists = await Crypto.findOne({ name });

    if (checkExists) {
      return res.status(400).json({ message: "crypto already exists" });
    }

    const details = await fetchCurrentPrice(name);

    if (details.length === 0) {
      return res.status(400).json({ error: "Check name again" });
    }

    const logo = details[0].image;
    const price = details[0].current_price;

    const newCryptocurrency = await Crypto.create({
      name,
      logo,
      price,
    });

    res.status(200).json({ newCryptocurrency });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCrypto = async (req, res) => {
  try {
    const id = req.params;
    await Crypto.findByIdAndDelete(id);

    res.json({ message: "Cryptocurrency deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchAndSaveCryptoPrices = async () => {
  try {
    const cryptocurrencies = await Crypto.find();

    for (const crypto of cryptocurrencies) {
      const name = crypto.name;

      try {
        const latestPriceResponse = await fetchCurrentPrice(name);

        if (latestPriceResponse.length === 0) {
          console.log(`Invalid cryptocurrency name: ${name}`);
          continue;
        }

        await Crypto.updateOne(
          { name },
          { $set: { price: latestPriceResponse[0].current_price } }
        );

        console.log(
          `Updated price for ${name}: ${latestPriceResponse[0].current_price}`
        );
      } catch (priceError) {
        console.error(
          `Error updating price for ${name}: ${priceError.message}`
        );
      }
    }

    console.log("Cryptocurrency prices updated successfully.");
  } catch (error) {
    console.error("Error updating cryptocurrency prices:", error.message);
  }
};

cron.schedule("*/10 * * * * *", fetchAndSaveCryptoPrices);

module.exports = { getAllCryptos, addCrypto, deleteCrypto, getCryptoByName };
