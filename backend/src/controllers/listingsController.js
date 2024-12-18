const { saveListing, fetchActiveListings } = require("../models/listingModel");
const { verifySignature } = require("../utils/verifySignature");

// Handle listing an NFT
const listNFT = async (req, res) => {
    const { seller, nftContract, tokenId, price, expiry, signature } = req.body;

    // Verify signature
    const order = { seller, nftContract, tokenId, price, expiry };
    const signer = verifySignature(order, signature);

    if (signer.toLowerCase() !== seller.toLowerCase()) {
        return res.status(400).json({ error: "Invalid signature" });
    }

    try {
        const listing = await saveListing({ seller, nftContract, tokenId, price, expiry, signature });
        res.status(201).json(listing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// Handle fetching active listings
const getActiveListings = async (req, res) => {
    try {
        const listings = await fetchActiveListings();
        res.status(200).json(listings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

module.exports = { listNFT, getActiveListings };
