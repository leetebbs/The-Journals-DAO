import styles from "../styles/all.module.scss"
import { contractAddress } from "../address.js"
import contractAbi from "../artifacts/contracts/PeerReview.sol/PeerReview.json"
import { useAccount } from "wagmi"
import web3modal from "web3modal"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
// />
export default function Home() {

    const { address } = useAccount()
	const [isMember, setIsMember] = useState()
<<<<<<< HEAD
	const [daoMembers, setDaoMembers] = useState([])
	const [totalMembers, setTotalMembers] = useState()

	async function getContract() {
		const modal = new web3modal()
		const connection = await modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer)
		return contract
	}

	async function checkMember() {
		const contract = await getContract()
		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		const txn = await contract.addressToDaoMember(accounts[0])
		setIsMember(txn[1])
	}

	async function handleJoinDao() {
		const contract = await getContract()
		const price = ethers.utils.parseUnits("1", "ether")
		const data = await contract.joinDao({ value: price });
		await data.wait();
	}

	async function handleLeaveDao() {
		const contract = await getContract()
		const txn = await contract.leaveDao()
		await txn.wait()
	}

	async function getDaoMembers() {
		const contract = await getContract()
		const txn = await contract.numDaoMembers()
		console.log(txn.toNumber())
		setTotalMembers(txn.toNumber())
		return txn
	}

	async function fetchDaoMembers() {
		const contract = await getContract()
		const totalMembers = await getDaoMembers()
		const array = []
		for (let i = 0; i < totalMembers; i++) {
			const txn = await contract.daoMembersTracking(i)
			array.push(txn)
		}
		setDaoMembers(array)
	}

	function MemberBlock(prop) {
		return (
			<>
				<p>{prop.serial})&nbsp;&nbsp;{prop.address}</p>
			</>
		)
	}


	return (
		<div className={styles.home}>
			<h1>Peer Review Dao</h1>
			<h2>Available dao's</h2>
			<div className={styles.daoCard}>
				<img src="MjI1ODI2NTAx-removebg-preview.png" />
				<p className={styles.daoName}>Scientific paper review dao</p>
				<p className={styles.daoInfo}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet et mauris auctor gravida. Ut ut lorem nec justo aliquet convallis eu sed dolor. Integer cursus consequat risus eget semper. Etiam condimentum.</p>
				{isMember ? <button className={styles.btn} onClick={handleLeaveDao}>Leave Dao</button> : <button className={styles.btn} onClick={handleJoinDao}>Join Dao</button>}
			</div>
			<div className={styles.memberList}>
				<h3>Dao Members</h3>
				<p>Total:&nbsp;&nbsp;{totalMembers}</p>
				{daoMembers.map((item, i) => (
					<MemberBlock
						key={i}
						serial={i + 1}
						address={item}
					/>
				))}
			</div>
		</div>
	)
}
=======
    const [daoMembers, setDaoMembers] = useState([])


    useEffect(() => {
        init()
    }, [address])

// check if wallet is connected
    async function init() {
        if (!address) {
            return
        } else {
            checkMember()
            fetchDaoMembers()
        }
    }

    async function getContract() {
        const modal = new web3modal()
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer)
        return contract
    }

    async function checkMember() {
        const contract = await getContract()
        const accounts = await ethereum.request({ method: "eth_requestAccounts" })
        const txn = await contract.addressToDaoMember(accounts[0])
        setIsMember(txn[1])
    }

    async function handleJoinDao() {
        const contract = await getContract()
        const price = ethers.utils.parseUnits("1", "ether")
        const data = await contract.joinDao({ value: price })
        await data.wait()
    }

    async function handleLeaveDao() {
        const contract = await getContract()
        const txn = await contract.leaveDao()
        await txn.wait()
    }

    async function getDaoMembers() {
        const contract = await getContract()
        const txn = await contract.numDaoMembers()
        return txn
    }

    async function fetchDaoMembers() {
        const contract = await getContract()
        const totalMembers = await getDaoMembers()
        const array = []
        for (let i = 0; i < totalMembers; i++) {
            const txn = await contract.daoMembersTracking(i)
            array.push(txn)			
        }
		console.log(array)
        setDaoMembers(array)
    }
// no key being passed ***** @ansh
    function MemberBlock(prop) {
		console.log("prop ",prop)

        return (
            <>
                <p>{prop.key}</p>
                <p>{prop.address}</p>
            </>
        )
    }

    return (
        <div className={styles.home}>
            <h1>Peer Review Dao</h1>
            <h2>Available dao's</h2>
            <div className={styles.daoCard}>
                <img src="MjI1ODI2NTAx-removebg-preview.png" />
                <p className={styles.daoName}>Scientific paper review dao</p>
                <p className={styles.daoInfo}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet et mauris
                    auctor gravida. Ut ut lorem nec justo aliquet convallis eu sed dolor. Integer
                    cursus consequat risus eget semper. Etiam condimentum.
                </p>
                {isMember ? (
                    <button className={styles.btn} onClick={handleLeaveDao}>
                        Leave Dao
                    </button>
                ) : (
                    <button className={styles.btn} onClick={handleJoinDao}>
                        Join Dao
                    </button>
                )}
            </div>
            <div className={styles.memberList}>
                <h3>Dao Members</h3>
                {daoMembers.map((item, i) => (
                    <MemberBlock key={i} address={item} />
                ))}
            </div>
        </div>
    )
}
>>>>>>> 62af130f103b7a356997d79098899a582ad3fc16
