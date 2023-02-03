require("@nomiclabs/hardhat-waffle"); 
const fs = require('fs'); 
const privateKey = fs.readFileSync(".secret").toString()

module.exports = { 
  defaultNetwork : "hardhat", 
  networks: { 
    hardhat: { 
      chainId: 1337 
    }, 
    wallaby: {  
      url: `https://wallaby.filfox.info/rpc/v1`,  
      accounts: [privateKey]  
    },
    hyperspace: {  
      url: `https://filecoin-hyperspace.chainstacklabs.com/rpc/v1`,  
      accounts: [privateKey]  
    },
  }, 
  solidity: { 
    version: "0.8.4", 
  } 
}