import { Navbar } from '../components/navbar'
import '../styles/globals.css'
import styles from '../styles/all.module.scss'
// import '@rainbow-me/rainbowkit/styles.css';
// import {
//   getDefaultWallets,
//   RainbowKitProvider,
//   darkTheme
// } from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import Login from '@/components/login';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ConnectKitProvider } from 'connectkit';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';


function MyApp({ Component, pageProps }) {

  // ------------

   const hyperspace = {
    id: 3_141,
    name: 'Hyperspace',
    network: 'Hyperspace',
    nativeCurrency: {
      decimals: 18,
      name: 'Filecoin',
      symbol: 'tFIL',
    },
    rpcUrls: {
      default: "https://filecoin-hyperspace.chainstacklabs.com/rpc/v0",
    },
}

const Mumbai = { 
  id: 80001, 
  name: 'Polygon mumbai', 
  network: 'Polygon mumbai', 
  nativeCurrency: { 
    decimals: 18, 
    name: 'MATIC', 
    symbol: 'MATIC', 
  }, 
  rpcUrls: { 
    default: 'https://rpc-mumbai.matic.today', 
  }, 
  blockExplorers: { 
    default: { name: 'Polygon PoS Chain Testnet Explorer', url: 'https://mumbai.polygonscan.com/' }, 
  }, 
  testnet: true, 
} 


const { chains, provider} = configureChains(
[hyperspace, Mumbai],
[
  jsonRpcProvider({
    rpc: (chain) => ({
      http: `https://filecoin-hyperspace.chainstacklabs.com/rpc/v0`,
    }),
  }),
],
)

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Pinsurnace',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
})


  return (
      <WagmiConfig client={client}>
         <ConnectKitProvider>
          <div className={styles.app} >
         <Navbar />
        <Component {...pageProps} />
         </div>
     </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default MyApp