'use client';

import React from 'react';
import { useWallet } from '@/context/WalletContext';

interface ConnectWalletProps {
  className?: string;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ className = "" }) => {
  const { publicKey, isConnected, isConnecting, connect, disconnect } = useWallet();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (isConnected && publicKey) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Status Indicator: Connected */}
        <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500">Connected</span>
        </div>

        <button 
          onClick={disconnect}
          className="glass border border-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white/10 hover:border-white/30 active:scale-95 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-primary" />
          {truncateAddress(publicKey)}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Status Indicator: Disconnected */}
      <div className="hidden sm:flex items-center space-x-1.5 px-2 py-1 rounded-full bg-gray-500/10 border border-gray-500/20">
        <span className="h-2 w-2 rounded-full bg-gray-500"></span>
        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Disconnected</span>
      </div>

      <button 
        onClick={connect}
        disabled={isConnecting}
        className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary/20 active:scale-95"
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : (
          'Connect Wallet'
        )}
      </button>
    </div>
  );
};

export default ConnectWallet;
