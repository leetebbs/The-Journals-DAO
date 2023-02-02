const { ethers } = require("hardhat"); 
const fs = require("fs"); 
const { TokenClass } = require("typescript");

async function main() { 
  const contract = await ethers.getContractFactory("PeerReview"); 
  const deployedContract = await contract.deploy(); 
      // 10 is value passed to constructor 
  await deployedContract.deployed(); 
      // Wait for it to finish deploying 
  console.log("Address:", deployedContract.address); 
  fs.writeFileSync('./address.js', `export const contractAddress = "${deployedContract.address}"`) 
} 

// Call the main function and catch if there is any error 
main() 
  .then(() => process.exit(0)) 
  .catch((error) => { 
    console.error(error); 
    process.exit(1); 
  });