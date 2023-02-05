import styles from "../styles/all.module.scss"
import { contractAddress } from "../address.js"
import contractAbi from "../artifacts/contracts/PeerReview.sol/PeerReview.json"
import * as PushAPI from "@pushprotocol/restapi"
import { Chat } from "@pushprotocol/uiweb"
import { api, EmbedSDK } from "@epnsproject/frontend-sdk-staging"
import web3modal from "web3modal"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { send } from "@pushprotocol/restapi/src/lib/chat"
// require('dotenv').config()

export default function Textroom() {



    const PK = 'c707650faa37c8d0595a3cd740de3a0efeada3dcd2bba391c395b0dc24e2db4a';// need env variable
    const Pkey = `0x${PK}`;
    const signer = new ethers.Wallet(Pkey);

    const [sign, setSign] = useState()
    const [account, setAccount] = useState()

    useEffect(() => {
        getContract()
    }, [])

    useEffect(() => {
        if (account) {
            // 'your connected wallet address'
            EmbedSDK.init({
                headerText: "Peer Review", // optional
                targetID: "sdk-trigger-id", // mandatory
                appName: "consumerApp", // mandatory
                user: account, // mandatory
                viewOptions: {
                    type: "sidebar", // optional [default: 'sidebar', 'modal']
                    showUnreadIndicator: true, // optional
                    unreadIndicatorColor: "#cc1919",
                    unreadIndicatorPosition: "bottom-left",
                },
                theme: "dark",
                onOpen: () => {
                    console.log("-> client dApp onOpen callback")
                },
                onClose: () => {
                    console.log("-> client dApp onClose callback")
                },
            })
        }
    }, [account])

    async function getContract() {
        const modal = new web3modal()
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const accounts = await provider.send("eth_requestAccounts", [])
        setAccount(accounts[0])
        const signer = provider.getSigner()
        setSign(signer)
        const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer)
        return contract
    }

    async function optIn() {
        // getContract()
        console.log(account)
        await PushAPI.channels.subscribe({
            signer: sign,
            channelAddress: "eip155:5:0x44d95Bed275cB9766e3D21334BC55Ba456873e78", // channel address in CAIP
            userAddress: "eip155:5:" + account, // user address in CAIP
            onSuccess: () => {
                console.log("opt in success")
            },
            onError: () => {
                console.error("opt in error")
            },
            env: "staging",
        })
    }

    async function optOut() {
        await PushAPI.channels.unsubscribe({
            signer: sign,
            channelAddress: "eip155:5:0x44d95Bed275cB9766e3D21334BC55Ba456873e78", // channel address in CAIP
            userAddress: "eip155:5:" + account, // user address in CAIP
            onSuccess: () => {
                console.log("opt out success")
            },
            onError: () => {
                console.error("opt out error")
            },
            env: "staging",
        })
    }

    async function sendNotification() {
        console.log(signer)
        // apiResponse?.status === 204, if sent successfully!
        const apiResponse = await PushAPI.payloads.sendNotification({
            signer,
            type: 1, // broadcast
            identityType: 2, // direct payload
            notification: {
                title: "tester from send",
                body: "this is a test",
            },
            payload: {
                title: "title for send",
                body: "body for test",
                cta: "",
                img: "",
            },
            channel: "eip155:5:0x44d95Bed275cB9766e3D21334BC55Ba456873e78", // your channel address
            env: "staging",
        })
        console.log(apiResponse)
    }

    return (
        <div className={styles.textroom}>
            {/* <h1 className={styles.heading}>Recieve Notifications</h1> */}
			<div className={styles.pushCard}>
			<img className={styles.bell} src="pushBell.png"></img>
				<h1>Opt in to Notifications</h1>
				<p>Recieve notifications from Peer Review Dao with Push</p>
				<a href="https://chrome.google.com/webstore/detail/push-protocol-alpha/lbdcbpaldalgiieffakjhiccoeebchmg" target="_blank" rel="noreferrer">
					<button>Push Alpha Extention</button>
				</a>
				<div className={styles.options}>
				<button onClick={optIn}>Opt-In</button>
            <button onClick={optOut}>Opt-Out</button>
				</div>
			</div>

            {/* <button onClick={sendNotification}>send notification</button> */}
            <button className={styles.sdktriggerid} id="sdk-trigger-id">
                check Notifications
            </button>
            <p>Connect wallet to Goerli</p>
            <Chat
                account={account} //user address
                supportAddress="0x44d95Bed275cB9766e3D21334BC55Ba456873e78" //support address
                apiKey="jVPMCRom1B.iDRMswdehJG7NpHDiECIHwYMMv6k2KzkPJscFIDyW8TtSnk4blYnGa8DIkfuacU0"
                env="staging"
            />
        </div>
    )
}
