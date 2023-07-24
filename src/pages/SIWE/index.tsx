import { useEffect, useState } from 'react';
import { SSX } from '@spruceid/ssx';
import { useAccount, useWalletClient } from 'wagmi';
import { useWeb3Modal } from "@web3modal/react";
import SignInModal from '../../components/SignInModal'
import { walletClientToEthers5Signer } from '../../utils/web3modalV2Settings';
import { getWalletClient } from '@wagmi/core'

const SIWE = (props : any) => {
  const { posts, likes, media } = props;
  const [ssxProvider, setSSX] = useState<SSX | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { isConnected } = useAccount();
  const { open: openWeb3Modal } = useWeb3Modal();
  const { data: walletClient } = useWalletClient()

  const initSSX = async () => {
    const chainId = await walletClient?.getChainId();
    const newWalletClient = await getWalletClient({ chainId });
    const signer = walletClientToEthers5Signer(newWalletClient as any);
    if (signer) {
      let ssxConfig = {
        providers: {
          web3: {
            driver: signer.provider
          }
        },
        modules: {
          storage: {
            prefix: 'teal',
            hosts: ['https://kepler.spruceid.xyz'],
            autoCreateNewOrbit: true,
          },
        },
        enableDaoLogin: true
      };

      const ssx = new SSX(ssxConfig);
      try {
        await ssx.signIn();
        setSSX(ssx);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSSX(null);
    }
  };

  useEffect(() => {
    initSSX();
  }, [walletClient]);

  useEffect(() => {
    if (isConnected && ssxProvider) {
      setShowSyncModal(true);
    }
  }, [ssxProvider]);

  const syncOrbit = () => {
    closeSyncModal();
    likes?.records?.map((like:any) => store("like/"+like.cid, like));
    posts?.feed?.map((post:any) => store("post/"+post.post.cid, post));
    setShowSuccessModal(true);
  };

  const store = async (key:any, value:any) => {
    await ssxProvider?.storage.put(key, value);
  };

  const ssxHandler = async () => {
    await openWeb3Modal();
  };

  const closeSyncModal = () => {
    setShowSyncModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleSignIn = async () => {
    await ssxHandler();
    closeSignInModal();
  };

  const [showSignInModal, setShowSignInModal] = useState(true);

  const closeSignInModal = () => {
    setShowSignInModal(false);
  };

  return (
    <>
      <SignInModal showModal={showSignInModal} onClose={closeSignInModal}>
        <h2>Sign in With Ethereum + Authorization</h2>
        <div>
          Sign in With Ethereum and authorize Teal to have access to
          read/write to your data vault. By logging in you accept our&nbsp;
          <a href="https://spruceid.com/termsofuse">terms of use</a>&nbsp;and&nbsp;
          <a href="https://spruceid.com/privacypolicy">privacy policy</a>.
        </div>
        <button
          onClick={handleSignIn}
          style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
        >
          Sign In
        </button>
      </SignInModal>

      <button
        onClick={syncOrbit}
        style={{ color: '#323232', backgroundColor: "white", border: "white", fontSize: "20px", marginLeft: "-6px" }}
      >
        <strong>sync</strong>
      </button>

      <SignInModal showModal={showSyncModal} onClose={closeSyncModal}>
        <h2>Wallet successfully connected!</h2>
        <button
          onClick={syncOrbit}
          style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
        >
          sync orbit
        </button>
      </SignInModal>

      <SignInModal showModal={showSuccessModal} onClose={closeSuccessModal}>
        <h2>Orbit Successfully Synced!</h2>
        <button
          onClick={closeSuccessModal}
          style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
        >
          OK
        </button>
      </SignInModal>
    </>
  );
};

export default SIWE;
