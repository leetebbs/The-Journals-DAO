import styles from '../styles/all.module.scss'
import { contractAddress } from "../address.js";
import contractAbi from "../artifacts/contracts/PeerReview.sol/PeerReview.json";

import web3modal from "web3modal";
import { ethers } from "ethers";
// />
export default function Home() {

	async function handleJoinDao() {
		const modal = new web3modal()
		const connection = await modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer)
		const price = ethers.utils.parseUnits("1", "ether")
		const data = await contract.joinDao({value: price});
		await data.wait();
	}


	return (
		<div className={styles.home}>
			<h1>Peer Review Dao</h1>
			<h2>Available dao's</h2>
			<div className={styles.daoCard}>
				<img src="MjI1ODI2NTAx-removebg-preview.png" />
				<p className={styles.daoName}>Scientific paper review dao</p>
				<p className={styles.daoInfo}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet et mauris auctor gravida. Ut ut lorem nec justo aliquet convallis eu sed dolor. Integer cursus consequat risus eget semper. Etiam condimentum.</p>
				<button onClick={handleJoinDao}>Join Dao</button>
			</div>
		</div>
	)
}
