import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { handleSession } from './Agent';
import './App.scss';
import Routes from './router/routes';
import { Toaster } from 'react-hot-toast';
import { WagmiConfig } from 'wagmi';
import { Web3Modal } from '@web3modal/react';

const queryClient = new QueryClient();

const Router = createHashRouter(Routes, {});
import { ethereumClient, projectId, wagmiConfig } from './utils/web3modalV2Settings';

function App() {
  useEffect(() => {
    handleSession();
  }, []);

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <div className="App">
            <RouterProvider router={Router} />
          </div>
        </QueryClientProvider>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

export default App;
