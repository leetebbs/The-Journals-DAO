import styles from '../styles/all.module.scss'
import { contractAddress } from "../address.js";
import contractAbi from "../artifacts/contracts/PeerReview.sol/PeerReview.json";
import * as PushAPI from "@pushprotocol/restapi"
import web3modal from "web3modal";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import lighthouse from '@lighthouse-web3/sdk';
import Link from 'next/link';

const Proposals = () => {

    useEffect(() => {
        fetchAllProposal()
        fetchAllPenalties()
    }, [])

    // env not working, idk why
    const PK = 'c707650faa37c8d0595a3cd740de3a0efeada3dcd2bba391c395b0dc24e2db4a'; //need env variable
    const Pkey = `0x${PK}`;
    const signer = new ethers.Wallet(Pkey);

    const [selectedTab, setSelectedTab] = useState("View Proposal")
    const [proposalData, setProposalData] = useState({
        cid: "",
        size: "",
        name: ""
    })
    const [penaltyData, setPenaltyData] = useState({
        user: "",
        reason: ""
    })
    const [proposals, setProposals] = useState([])
    const [penalties, setPenalties] = useState([])
    const [pushTitle, setPushTitle] = useState()

    //Push notification

    async function sendNotification() {
        // apiResponse?.status === 204, if sent successfully!
        const apiResponse = await PushAPI.payloads.sendNotification({
            signer,
            type: 1, // broadcast
            identityType: 2, // direct payload
            notification: {
                title: "Peer Review DAO",
                body: pushTitle,
            },
            payload: {
                title: "Proposal",
                body: "A Proposal has just been submited for review!",
                cta: "",
                img: "",
            },
            channel: "eip155:5:0x44d95Bed275cB9766e3D21334BC55Ba456873e78", // your channel address
            env: "staging",
        })
        console.log(apiResponse)
    }

    // lighthouse

    const progressCallback = (progressData) => {
        let percentageDone =
          100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
        console.log(percentageDone);
      };

    async function lighthouseUpload(e) {
        const output = await lighthouse.upload(e, `bf9ebee0-3e4f-4647-a3e1-79d78de822b5`, progressCallback)
        console.log('File Status:', output)
        setProposalData({ cid: output.data.Hash, size: output.data.Size, name: output.data.Name })
        // console.log(`https://gateway.lighthouse.storage/ipfs/${output.Hash}`)
    }

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
        const price = ethers.utils.parseUnits("0.1", "ether")
        const txn = await contract.createProposal(proposalData.cid.toString(), proposalData.size, proposalData.name.toString(), {value: price})
        await txn.wait()
        setPushTitle("Proposal Submitted")
        sendNotification()
        fetchAllProposal()
    }

    async function getNumProposalsInDAO() {
        try {
            const contract = await getContract()
            const daoNumProposals = await contract.numProposal();
            return daoNumProposals
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchProposalById(id) {
        const contract = await getContract()
        const proposal = await contract.idToProposal(id) /// ****
        // console.log(proposal)
        const parsedProposal = {
            proposalId: id,
            author: proposal.author.toString(),
            cid: proposal.cid.toString(),
            size: proposal.size.toNumber(),
            name: proposal.name.toString(),
            upvote: proposal.upvote.toNumber(),
            downvote: proposal.downvote.toNumber(),
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

    async function upvote(proposalId) {
        const contract = await getContract()
        const txn = await contract.upvote(proposalId);
        await txn.wait();
        await fetchAllProposal();
    }

    async function downvote(proposalId) {
        const contract = await getContract()
        const txn = await contract.downvote(proposalId);
        await txn.wait();
        await fetchAllProposal();
    }

    async function executeProposal(prop) {
        const contract = await getContract()
        const txn = await contract.execute(prop.proposalId);        
        await txn.wait();
        await fetchAllProposal();
        if(txn == true) {
            const cid = prop.cid
            uploadToLighthouse(cid)
        }
    }

    function renderProposal() {
        return (
            <>
                <div className={styles.inputDiv}>
                    <input onChange={e => lighthouseUpload(e)} type="file" />
                    <button className={styles.proposeBtn} onClick={createProposal}>Propose</button>
                    <button><Link target="_blank" rel="noreferrer" href={`https://gateway.lighthouse.storage/ipfs/${proposalData.cid}`}>Check your file</Link></button>
                </div>
                <div className={styles.cardContainer}>
                    {proposals.map((item, i) => (
                        <ProposalCard
                            key={i}
                            proposalId={item.proposalId}
                            cid={item.cid}
                            size={item.size}
                            name={item.name}
                            author={item.author}
                            executed={item.executed}
                            deadline={item.deadline}
                            upvote={item.upvote}
                            downvote={item.downvote}
                        />
                    ))}
                </div>
            </>
        )
    }

    function ProposalCard(prop) {
        return (
            <div className={styles.card}>
                <p>cid: {prop.cid}</p>
                <p>size: {prop.size}</p>
                <p>file name: {prop.name}</p>
                <p>author: {prop.author}</p>
                <div className={styles.cardBtns}>
                    <button className={styles.cardBtn} onClick={() => upvote(prop.proposalId)}> Upvote </button>
                    <button className={styles.cardBtn} onClick={() => downvote(prop.proposalId)}> Downvote </button>
                    <button className={styles.cardBtn} onClick={() => executeProposal(prop)}> Execute </button>
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
            return daoNumProposals
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchPenaltiesById(id) {
        const contract = await getContract()
        const proposal = await contract.idToPenalty(id)
        // console.log(proposal)
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

    async function upvotePenalty(proposalId) {
        const contract = await getContract()
        const txn = await contract.upvotePenalty(proposalId);
        await txn.wait();
        await fetchAllPenalties();
    }

    async function downvotePenalty(proposalId) {
        const contract = await getContract()
        const txn = await contract.downvotePenalty(proposalId);
        await txn.wait();
        await fetchAllPenalties();
    }

    async function executePenalty(proposalId) {
        const contract = await getContract()
        const txn = await contract.executePenalty(proposalId);
        await txn.wait();
        await fetchAllPenalties();
    }

    function renderPenalties() {
        return (
            <>
                <div className={styles.inputDiv}>
                    <input name="user" placeholder="user" required onChange={(e) => setPenaltyData({ ...penaltyData, user: e.target.value, })} />
                    <input name="reason" placeholder="reason" required onChange={(e) => setPenaltyData({ ...penaltyData, reason: e.target.value, })} />
                    <button onClick={createPenalties}>Penalize (for only dao members)</button>
                </div>
                <div className={styles.cardContainer}>
                    {penalties.map((item, i) => (
                        <PenaltyCard
                            key={i}
                            proposalId={item.proposalId}
                            cid={item.cid}
                            size={item.size}
                            author={item.author}
                            executed={item.executed}
                            deadline={item.deadline}
                            upvote={item.penaltyUpvote}
                            downvote={item.penaltyDownvote}
                        />
                    ))}
                </div>
            </>
        )
    }

    function PenaltyCard(prop) {
        return (
            <div className={styles.card}>
                <p>cid: {prop.cid}</p>
                <p>size: {prop.size}</p>
                <p>author: {prop.author}</p>
                <div className={styles.cardBtns}>
                    <button className={styles.cardBtn} onClick={() => upvotePenalty(prop.proposalId)}> Upvote </button>
                    <button className={styles.cardBtn} onClick={() => downvotePenalty(prop.proposalId)}> Downvote </button>
                    <button className={styles.cardBtn} onClick={() => executePenalty(prop.proposalId)}> Execute </button>
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
        </div>
    )
}

export default Proposals