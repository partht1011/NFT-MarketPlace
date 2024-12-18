import "@nomicfoundation/hardhat-toolbox"

import { HardhatUserConfig } from "hardhat/config"

import "hardhat-deploy"
import "@nomiclabs/hardhat-solhint"
import "hardhat-deploy"
import "solidity-coverage"

import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/your-api-key"
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/your-api-key"

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "api-key"

// Import MNEMONIC or single private key
const MNEMONIC = process.env.MNEMONIC || "your mnemonic"
const PRIVATE_KEY = process.env.PRIVATE_KEY

const config: HardhatUserConfig = {
	defaultNetwork: "hardhat",
	networks: {
		mainnet: {
			url: MAINNET_RPC_URL,
			accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
		},
		hardhat: {
			// If you want to do some forking, uncomment this
			forking: {
				url: MAINNET_RPC_URL
			}
		},
		localhost: {
			url: "http://127.0.0.1:8545",
		},
		sepolia: {
			url: SEPOLIA_RPC_URL,
			accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
		},
	},
	etherscan: {
		// Your API key for Etherscan
		// Obtain one at https://etherscan.io/
		apiKey: {
			mainnet: ETHERSCAN_API_KEY,
			sepolia: ETHERSCAN_API_KEY,
		},
	},
	namedAccounts: {
		deployer: {
			default: 0, // here this will by default take the first account as deployer
			mainnet: 0, // similarly on mainnet it will take the first account as deployer.
		},
		owner: {
			default: 0,
		},
	},
	solidity: {
		compilers: [
			{
				version: "0.8.20",
			},
		],
	},
}

export default config
