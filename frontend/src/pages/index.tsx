import React, { useState, useEffect } from "react"
import axios from "axios"

// Define the type for a listing
interface Listing {
	id: number
	nft_contract_address: string
	token_id: string
	price: string
	expiry: string
}

const Home = () => {
	const [listings, setListings] = useState<Listing[]>([])

	useEffect(() => {
		axios
			.get("/api/listings")
			.then((res) => {
				setListings(res.data)
			})
			.catch((error) => {
				console.error("Error fetching listings:", error)
			})
	}, [])

	return (
		<div>
			<h1>Marketplace</h1>
			{listings.map((listing) => (
				<div key={listing.id}>
					<p>NFT Contract: {listing.nft_contract_address}</p>
					<p>Token ID: {listing.token_id}</p>
					<p>Price: {listing.price} ETH</p>
					<p>Expiry: {new Date(listing.expiry).toLocaleString()}</p>
				</div>
			))}
		</div>
	)
}

export default Home
