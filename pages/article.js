import { useEffect, useState } from 'react'
import styles from '../styles/all.module.scss'
import { contractAddress } from "../address.js";
import contractAbi from "../artifacts/contracts/PeerReview.sol/PeerReview.json";
import web3modal from "web3modal";
import { ethers } from "ethers";
import Link from 'next/link';

const Articles = () => {

    useEffect(() => {
        fetchAllArticles()
    }, [])

    const [proposals, setProposals] = useState([])

    async function getContract() {
        const modal = new web3modal();
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer)
        return contract
    }

    async function getNumArticlesInDAO() {
        try {
            const contract = await getContract()
            const daoNumProposals = await contract.numReviewed();
            return daoNumProposals
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchArticlesById(id) {
        const contract = await getContract()
        const proposal = await contract.idToReviewed(id)
        // console.log(proposal)
        const parsedProposal = {
            proposalId: id,
            author: proposal.author.toString(),
            cid: proposal.cid.toString(),
            size: proposal.size.toNumber(),
            name: proposal.name.toString()
        };
        console.log(parsedProposal)
        return parsedProposal;
    }

    async function fetchAllArticles() {
        const proposals = [];
        const numProposals = await getNumArticlesInDAO()
        for (let i = 0; i < numProposals; i++) {
            const proposal = await fetchArticlesById(i + 1);
            proposals.push(proposal);
        }
        setProposals(proposals);
    }

    async function viewArticles() {
        const contract = await getContract()
        const txn = await contract.obtainViewship();
    }

    function ProposalCard(prop) {
        return (
            <div className={styles.card}>
                <p>name: {prop.name}</p>
                <p>author: {prop.author}</p>
                <button className={styles.articleButton}><Link target="_blank" rel="noreferrer" href={`https://gateway.lighthouse.storage/ipfs/${prop.cid}`}>Check article</Link></button>
                {/* <button className={styles.cardBtn} onClick={() => viewArticles()}> Obtain Viewship </button> */}
            </div>
            
        )
    }

    return (
        <div className={styles.articles}>
            <h1>Premium selected articles</h1>
            <div className={styles.cardContainer}>
                {proposals.map((item, i) => (
                    <ProposalCard
                        key={i}
                        cid={item.cid}
                        size={item.size}
                        name={item.name}
                        author={item.author}
                        proposalId={item.proposalId}
                    />
                ))}
            </div>
        </div>
    )
}

export default Articles