const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Crypto = mongoose.model("Crypto", cryptoSchema);

module.exports = Crypto;
