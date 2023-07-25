import React from 'react';

type SignInModalProps = {
  showModal: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const SignInModal = ({ showModal, onClose, children }: SignInModalProps) => {
  if (!showModal) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10
      }}
      id='backdrop'
      onMouseDown={(event): void => {
        const me = document.getElementById('backdrop')
        if(event.target === me) {
          onClose?.();
        }
      }}
    >
      <div
        style={{
          width: '400px',
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 20,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SignInModal;
