import { Navbar } from '../components/navbar'
import '../styles/globals.css'
import styles from '../styles/all.module.scss'
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

const wallaby = { 
  id: 31415, 
  name: 'Wallaby testnet', 
  network: 'Wallaby testnet', 
  nativeCurrency: { 
    decimals: 18, 
    name: 'tFIL', 
    symbol: 'tFIL', 
  }, 
  rpcUrls: { 
    default: 'https://wallaby.filfox.info/rpc/v0', 
  }, 
  blockExplorers: { 
    default: { name: 'Filfox Explorer', url: 'https://wallaby.filfox.info/en' }, 
  }, 
  testnet: true, 
} 


const { chains, provider} = configureChains(
[hyperspace, wallaby],
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
        appName: 'ThePeerDao',
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