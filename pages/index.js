import styles from '../styles/all.module.scss'
import { contractAddress } from "../address.js"; 
import contractAbi from "../artifacts/contracts/PeerReview.sol/PeerReview.json";

import web3modal from "web3modal"; 
import { ethers } from "ethers";
// />
export default function Home() {

	async function joinDao() {
		const modal = new web3modal()
		const connection = await modal.connect()
		const provider = new ethers.providers.Web3Provider(connection) 
		const signer = provider.getSigner()
		const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer)
		const data = await contract.func(input.toString());
		await data.wait();
	}


  return (
    <div className={styles.home}>
      <h1>Peer Review Dao</h1>
	  <div className={styles.daoCard}>
		<img src="" />
		<p>some info about this</p>
		<button onClick={joinDao}>Join Dao</button>
	  </div>
    </div>
  )
}
