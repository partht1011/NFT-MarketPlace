const pool = require("../config/db");

// Save a new listing
const saveListing = async (listing) => {
    const query = `
        INSERT INTO nft_listings (seller_address, nft_contract_address, token_id, price, expiry, signature)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [
        listing.seller,
        listing.nftContract,
        listing.tokenId,
        listing.price,
        new Date(listing.expiry * 1000),
        listing.signature,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Fetch active listings
const fetchActiveListings = async () => {
    const query = `SELECT * FROM nft_listings WHERE expiry > NOW()`;
    const result = await pool.query(query);
    return result.rows;
};

module.exports = { saveListing, fetchActiveListings };
