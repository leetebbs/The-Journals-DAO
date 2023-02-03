import styles from '../styles/all.module.scss'
import { contractAddress } from "../address.js";
import contractAbi from "../artifacts/contracts/PeerReview.sol/PeerReview.json";
import * as PushAPI from "@pushprotocol/restapi";
import { Chat } from "@pushprotocol/uiweb";
import { api, EmbedSDK } from "@epnsproject/frontend-sdk-staging";
import web3modal from "web3modal";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { send } from '@pushprotocol/restapi/src/lib/chat';

export default function Home() {

	const [sign, setSign] = useState()
	const [account, setAccount] = useState()

	useEffect(() => {
		getContract()
	},[])

	useEffect(() => {

		if (account) { // 'your connected wallet address'
		  EmbedSDK.init({
			headerText: 'Peer Review', // optional
			targetID: 'sdk-trigger-id', // mandatory
			appName: 'consumerApp', // mandatory
			user: account, // mandatory
			viewOptions: {
				type: 'sidebar', // optional [default: 'sidebar', 'modal']
				showUnreadIndicator: true, // optional
				unreadIndicatorColor: '#cc1919',
				unreadIndicatorPosition: 'bottom-left',
			},
			theme: 'dark',
			onOpen: () => {
			  console.log('-> client dApp onOpen callback');
			},
			onClose: () => {
			  console.log('-> client dApp onClose callback');
			}
		  });
		}
	},[account])

	async function getContract() {
		const modal = new web3modal()
		const connection = await modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const accounts = await provider.send("eth_requestAccounts", []);
		setAccount(accounts[0])
		const signer = provider.getSigner()
		setSign(signer)
		const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer)
		return contract
	}

	async function optIn(){
		// getContract()
		console.log(account)
		await PushAPI.channels.subscribe({
			signer: sign,
			channelAddress: 'eip155:5:0x1ABc133C222a185fEde2664388F08ca12C208F76', // channel address in CAIP
			userAddress: 'eip155:5:' + account, // user address in CAIP
			onSuccess: () => {
			 console.log('opt in success');
			},
			onError: () => {
			  console.error('opt in error');
			},
			env: 'staging'
		  })
	}
	
	async function optOut(){
		await PushAPI.channels.unsubscribe({
			signer: sign,
			channelAddress: 'eip155:5:0x1ABc133C222a185fEde2664388F08ca12C208F76', // channel address in CAIP
			userAddress: 'eip155:5:' + account, // user address in CAIP
			onSuccess: () => {
			 console.log('opt out success');
			},
			onError: () => {
			  console.error('opt out error');
			},
			env: 'staging'
	})}

	async function sendNotification(){
		console.log(sign)
		// apiResponse?.status === 204, if sent successfully!
const apiResponse = await PushAPI.payloads.sendNotification({
	sign,
	type: 1, // broadcast
	identityType: 2, // direct payload
	notification: {
	  title: 'tester from send',
	  body: 'this is a test'
	},
	payload: {
	  title: 'title for send',
	  body: 'body for test',
	  cta: '',
	  img: ''
	},
	channel: 'eip155:5:0x1ABc133C222a185fEde2664388F08ca12C208F76', // your channel address
	env: 'staging'
  });
  console.log(apiResponse)
	}

	return (
		<div className={styles.home}>
			<button onClick={optIn}>opt in</button>
			<button onClick={optOut}>opt out</button>
			<button onClick={sendNotification}>send notification</button>
			<button id="sdk-trigger-id">check Notifications</button>
			<Chat
   account= {account} //user address
   supportAddress="0x1ABc133C222a185fEde2664388F08ca12C208F76" //support address
   apiKey="jVPMCRom1B.iDRMswdehJG7NpHDiECIHwYMMv6k2KzkPJscFIDyW8TtSnk4blYnGa8DIkfuacU0"
    env="staging"
 />
		</div>
	)
}
