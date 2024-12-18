const express = require("express");
const { listNFT, getActiveListings } = require("../controllers/listingsController");

const router = express.Router();

router.post("/list", listNFT);
router.get("/listings", getActiveListings);

module.exports = router;
