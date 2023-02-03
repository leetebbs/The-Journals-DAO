import styles from '../styles/all.module.scss'
import { contractAddress } from "../address.js";
import contractAbi from "../artifacts/contracts/PeerReview.sol/PeerReview.json";

import web3modal from "web3modal";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';

const Proposals = () => {

    useEffect(() => {
        fetchAllProposal()
        fetchAllPenalties()
    }, [])

    const [selectedTab, setSelectedTab] = useState("View Proposal")
    const [proposalData, setProposalData] = useState({
        cid: "",
        size: ""
    })
    const [penaltyData, setPenaltyData] = useState({
        user: "",
        reason: ""
    })
    const [proposals, setProposals] = useState([])
    const [penalties, setPenalties] = useState([])

    // contract instance

    async function getContract() {
        const modal = new web3modal();
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer)
        return contract
    }

    // proposals

    async function createProposal() {
        const contract = await getContract()
        const txn = await contract.createProposal(proposalData.cid.toString(), proposalData.size)
        await txn.wait()
        fetchAllProposal()
    }

    async function getNumProposalsInDAO() {
        try {
            const contract = await getContract()
            const daoNumProposals = await contract.numProposal();
            // setNumProposals(daoNumProposals.toString());
            console.log(daoNumProposals)
            return daoNumProposals
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchProposalById(id) {
        const contract = await getContract()
        const proposal = await contract.idToProposal(id)
        console.log(proposal)
        const parsedProposal = {
            proposalId: id,
            author: proposal.author.toString(),
            cid: proposal.cid.toString(),
            size: proposal.size.toNumber(),
            yayVotes: proposal.upvote.toNumber(),
            nayVotes: proposal.downvote.toNumber(),
            executed: proposal.executed,
        };
        console.log(parsedProposal)
        return parsedProposal;
    }

    async function fetchAllProposal() {
        const proposals = [];
        const numProposals = await getNumProposalsInDAO()
        for (let i = 0; i < numProposals; i++) {
            const proposal = await fetchProposalById(i + 1);
            proposals.push(proposal);
        }
        setProposals(proposals);
    }

    function renderProposal() {
        return (
            <>
                <div className={styles.inputDiv}>
                    <input name="cid" placeholder="cid" required onChange={(e) => setProposalData({ ...proposalData, cid: e.target.value, })} />
                    <input name="size" placeholder="size (bytes)" required onChange={(e) => setProposalData({ ...proposalData, size: e.target.value, })} />
                    <button onClick={createProposal}>Propose</button>
                </div>
                {proposals.map((item, i) => (
                    <ProposalCard
                        key={i}
                        cid={item.cid}
                        size={item.size}
                        author={item.author}
                        executed={item.executed}
                        deadline={item.deadline}
                        yay={item.yayVotes}
                        nay={item.nayVotes}
                    />
                ))}
            </>
        )
    }

    function ProposalCard(prop) {
        return (
            <div className={styles.card}>
                {/* <img src={uri} /> */}
                <div className={styles.subDiv}>
                    <h4>cid: {prop.cid}</h4>
                    <h4>size: {prop.size}</h4>
                    <h4>author: {prop.author}</h4>
                    <div className={styles.cardBtns}>
                        <button className={styles.cardBtn} onClick={() => upvote(prop.proposalId)}> yay </button>
                        <button className={styles.cardBtn} onClick={() => downvote(prop.proposalId)}> nay </button>
                        <button className={styles.cardBtn} onClick={() => executeProposal(prop.proposalId)}> Execute </button>
                    </div>
                </div>
            </div>
        )
    }

    // penalties

    async function createPenalties() {
        const contract = await getContract()
        const txn = await contract.createPenalty(penaltyData.user, penaltyData.reason)
        await txn.wait()
        fetchAllPenalties()
    }

    async function getNumPenaltiesInDAO() {
        try {
            const contract = await getContract()
            const daoNumProposals = await contract.numPenaltyProposal();
            // setNumProposals(daoNumProposals.toString());
            return daoNumProposals
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchPenaltiesById(id) {
        const contract = await getContract()
        const proposal = await contract.idToPenalty(id)
        console.log(proposal)
        const parsedProposal = {
            proposalId: id,
            user: proposal.user.toString(),
            reason: proposal.reason.toString(),
            yayVotes: proposal.penaltyUpvote.toNumber(),
            nayVotes: proposal.penaltyDownvote.toNumber(),
            executed: proposal.executed,
        };
        console.log(parsedProposal)
        return parsedProposal;
    }

    async function fetchAllPenalties() {
        const proposals = [];
        const numProposals = await getNumPenaltiesInDAO()
        for (let i = 0; i < numProposals; i++) {
            const proposal = await fetchPenaltiesById(i + 1);
            proposals.push(proposal);
        }
        setPenalties(proposals);
    }

    function renderPenalties() {
        return (
            <>
                <div className={styles.inputDiv}>
                    <input name="user" placeholder="user" required onChange={(e) => setPenaltyData({ ...penaltyData, user: e.target.value, })} />
                    <input name="reason" placeholder="reason" required onChange={(e) => setPenaltyData({ ...penaltyData, reason: e.target.value, })} />
                    <button onClick={createPenalties}>Penalize</button>
                </div>
                {penalties.map((item, i) => (
                    <PenaltyCard
                        key={i}
                        cid={item.cid}
                        size={item.size}
                        author={item.author}
                        executed={item.executed}
                        deadline={item.deadline}
                        yay={item.yayVotes}
                        nay={item.nayVotes}
                    />
                ))}
            </>
        )
    }

    function PenaltyCard(prop) {
        return (
            <div className={styles.card}>
                {/* <img src={uri} /> */}
                <div className={styles.subDiv}>
                    <h4>cid: {prop.cid}</h4>
                    <h4>size: {prop.size}</h4>
                    <h4>author: {prop.author}</h4>
                    <div className={styles.cardBtns}>
                        <button className={styles.cardBtn} onClick={() => upvotePenalty(prop.proposalId)}> yay </button>
                        <button className={styles.cardBtn} onClick={() => downvotePenalty(prop.proposalId)}> nay </button>
                        <button className={styles.cardBtn} onClick={() => executePenalty(prop.proposalId)}> Execute </button>
                    </div>
                </div>
            </div>
        )
    }

    function renderTabs() {
        if (selectedTab === "View Proposal") {
            return renderProposal();
        } else if (selectedTab === "View Penalties") {
            return renderPenalties();
        }
        return null;
    }


    return (
        <div className={styles.proposals}>
            <div className={styles.btnDiv}>
                <button className={styles.btn} onClick={() => setSelectedTab("View Proposal")} >Show proposal</button>
                <button className={styles.btn} onClick={() => setSelectedTab("View Penalties")} >Show penalties</button>
            </div>
            {renderTabs()}
            <div className={styles.cardContainer}>
            </div>
        </div>
    )
}

export default Proposals