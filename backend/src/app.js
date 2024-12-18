const express = require("express");
const bodyParser = require("body-parser");
const listingsRoutes = require("./routes/listingsRoutes");

const app = express();
app.use(bodyParser.json());

// API routes
app.use("/api", listingsRoutes);

module.exports = app;
