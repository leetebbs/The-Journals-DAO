import { useEffect, useState } from 'react'
import styles from '../styles/all.module.scss'
import { contractAddress } from "../address.js"
import contractAbi from "../artifacts/contracts/PeerReview.sol/PeerReview.json"
import web3modal from "web3modal"
import { ethers } from "ethers"
import { useRouter } from "next/router";
import Link from 'next/link';

const Editor = () => {

    useEffect(() => {
        fetchAllJournals()
        getTotalEditors()
        checkMember()
    }, [])

    const router = useRouter();

    const [numEditors, setNumEditors] = useState(0)
    const [isEditor, setIsEditor] = useState()
    const [journals, setJournals] = useState([])

    async function getContract() {
        const modal = new web3modal();
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer)
        return contract
    }

    async function checkMember() {
        const contract = await getContract()
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const txn = await contract.addressToJournalMember(accounts[0])
        setIsEditor(txn[1])
    }

    async function getTotalEditors() {
        const contract = await getContract()
        const txn = await contract.numEditors()
        console.log(txn.toNumber())
        setNumEditors(txn.toString())
    }

    async function handleJoinEditor() {
        const contract = await getContract()
        const price = ethers.utils.parseUnits("1", "ether")
        const data = await contract.joinEditor({ value: price });
        await data.wait();
        checkMember()
    }

    async function handleLeaveEditor() {
        const contract = await getContract()
        const txn = await contract.leaveEditor()
        await txn.wait()
        checkMember()
    }

    async function getNumJournalsInDAO() {
        try {
            const contract = await getContract()
            const daoNumProposals = await contract.numJournals();
            return daoNumProposals
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchJournalsById(id) {
        const contract = await getContract()
        const proposal = await contract.idToJournal(id)
        // console.log(proposal)
        const parsedProposal = {
            proposalId: id,
            cid: proposal.cid.toString(),
            size: proposal.size.toNumber(),
            name: proposal.name.toString(),
            author: proposal.author.toString(),
        };
        console.log(parsedProposal)
        return parsedProposal;
    }

    async function fetchAllJournals() {
        const proposals = [];
        const numProposals = await getNumJournalsInDAO()
        for (let i = 0; i < numProposals; i++) {
            const proposal = await fetchJournalsById(i + 1);
            proposals.push(proposal);
        }
        setJournals(proposals);
    }

    async function approve(proposalId) {
        const contract = await getContract()
        const txn = await contract.allowProposal(proposalId);
        await txn.wait();
        await fetchAllJournals();
    }


    function JournalCard(prop) {
        console.log(prop)// there is no propsal id in the props 
        return (
            <div className={styles.card}>
                <p>cid: {prop.cid}</p>
                <p>size: {prop.size}</p>
                <p>file name: {prop.name}</p>
                <p>author: {prop.author}</p>
                <div className={styles.cardBtns}>
                    <button className={styles.cardBtn} onClick={() => approve(prop.proposalId)}> Approve </button>
                    <button className={styles.cardBtn} onClick={() => approve(prop.proposalId)}> Disapprove </button>
                    <button className={styles.cardBtn}><Link target="_blank" rel="noreferrer" href={`https://gateway.lighthouse.storage/ipfs/${prop.cid}`}>Read</Link></button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.editor}>
            <h1>Editor Section</h1>
            <p>Number of editors: {numEditors}</p>
            {isEditor ? <button className={styles.btn} onClick={handleLeaveEditor}>Leave</button> : <button className={styles.btn} onClick={handleJoinEditor}>Become Editor</button>}
            <div className={styles.cardContainer}>
                {journals.map((item, i) => (
                    <JournalCard
                        key={i}
                        cid={item.cid}
                        size={item.size}
                        name={item.name}
                        proposalId={item.proposalId}
                        author={item.author}
                    />
                ))}
            </div>
        </div>
    )
}

export default Editor