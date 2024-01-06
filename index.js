const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();

dotenv.config();

// Middleware
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crypto API",
      version: "1.0.0",
      description: "Crypto price API",
    },
    servers: [{ url: "http://localhost:8080" }],
  },
  apis: ["./src/routes/*.js"],
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

mongoose.connection.once("open", () => {
  console.log("Database Connected Successfully!");
});

//Routes
const userRoutes = require("./src/routes/userRoutes");
const cryptoRoutes = require("./src/routes/cryptoRoutes");

const specs = swaggerJSDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/user", userRoutes);
app.use("/crypto", cryptoRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
