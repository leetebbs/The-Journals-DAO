import styles from '../styles/all.module.scss'
import { contractAddress } from "../address.js";
import contractAbi from "../artifacts/contracts/PeerReview.sol/PeerReview.json";

import web3modal from "web3modal";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
// />
export default function Home() {

	async function getContract() {
		const modal = new web3modal()
		const connection = await modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer)
		return contract
	}

	return (
		<div className={styles.home}></div>
	)
}
