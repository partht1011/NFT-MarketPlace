import React from "react"
import { useState } from "react"
import { ethers } from "ethers"
import axios from "axios"

const ListNFT = () => {
	const [formData, setFormData] = useState({
		nftContract: "",
		tokenId: "",
		price: "",
		expiry: "",
	})

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const listNFT = async () => {
		const { nftContract, tokenId, price, expiry } = formData

		const provider = new ethers.BrowserProvider(window.ethereum)
		const signer = await provider.getSigner()
		const seller = signer.address

		const domain = {
			name: "NFT Marketplace",
			version: "1",
			chainId: await provider.getNetwork().then((net) => net.chainId),
			verifyingContract: "0xYourMarketplaceContractAddress",
		}

		const types = {
			Order: [
				{ name: "seller", type: "address" },
				{ name: "nftContract", type: "address" },
				{ name: "tokenId", type: "uint256" },
				{ name: "price", type: "uint256" },
				{ name: "expiry", type: "uint256" },
			],
		}

		const order = {
			seller,
			nftContract,
			tokenId: parseInt(tokenId),
			price: ethers.parseEther(price),
			expiry: Math.floor(new Date(expiry).getTime() / 1000),
		}

		const signature = await signer.signTypedData(domain, types, order)

		await axios.post("/api/list", { ...order, signature })
		alert("NFT Listed!")
	}

	return (
		<div>
			<h1>List Your NFT</h1>
			<input name="nftContract" placeholder="NFT Contract Address" onChange={handleChange} />
			<input name="tokenId" placeholder="Token ID" onChange={handleChange} />
			<input name="price" placeholder="Price (ETH)" onChange={handleChange} />
			<input name="expiry" type="datetime-local" onChange={handleChange} />
			<button onClick={listNFT}>List NFT</button>
		</div>
	)
}

export default ListNFT
