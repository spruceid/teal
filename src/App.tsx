import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import {  RouterProvider, createHashRouter } from 'react-router-dom';
import { handleSession } from './Agent';
import './App.scss';
import Routes from './router/routes';
import { Toaster } from 'react-hot-toast';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider
} from '@web3modal/ethereum';
import {
  configureChains,
  createClient,
  WagmiConfig
} from 'wagmi';
import {
  arbitrum,
  avalanche,
  bsc,
  fantom,
  mainnet,
  optimism,
  polygon
} from 'wagmi/chains';
import { Web3Modal } from '@web3modal/react';

console.log(process.env)
export const projectId = process.env.REACT_APP_PROJECT_ID!;
if (!process.env.REACT_APP_PROJECT_ID) {
  console.error('You need to provide REACT_APP_PROJECT_ID env variable');
}

// 2. Configure wagmi client
const chains = [mainnet, polygon, optimism, arbitrum, avalanche, fantom, bsc];

const {
  provider
} = configureChains(chains, [walletConnectProvider({
  projectId
})]);

export const wagmiClient = createClient({
  autoConnect: false,
  connectors: modalConnectors({
    appName: 'web3Modal',
    chains
  }),
  provider
});

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiClient, chains);

const queryClient = new QueryClient();

const Router = createHashRouter(Routes,{
});

function App() {

  useEffect(() => {
    handleSession();
  }, []);

  return (
    <><WagmiConfig client={wagmiClient}>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <div className="App">
          <RouterProvider router={Router} />
        </div>
      </QueryClientProvider>
    </WagmiConfig>
    <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient} /></>
  )
}

export default App