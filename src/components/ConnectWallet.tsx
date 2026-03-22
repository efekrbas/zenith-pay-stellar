'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { QRCodeSVG } from 'qrcode.react';

interface ConnectWalletProps {
  className?: string;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ className = "" }) => {
  const { publicKey, isConnected, isConnecting, error, connect, disconnect } = useWallet();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const copyToClipboard = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDetails(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isConnected && publicKey) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500">Connected</span>
          </div>

          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="glass border border-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white/10 hover:border-white/30 active:scale-95 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-primary" />
            {truncateAddress(publicKey)}
            <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Dropdown Menu */}
        {showDetails && (
          <div className="absolute right-0 mt-3 w-72 glass border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in duration-200 z-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-white rounded-xl shadow-inner">
                <QRCodeSVG value={publicKey} size={150} level="H" includeMargin />
              </div>
              
              <div className="w-full space-y-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold px-1">Public Address</p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 break-all text-xs font-mono text-gray-300">
                  {publicKey}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 text-xs font-semibold text-white transition-all"
                >
                  {copied ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 012-2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => { disconnect(); setShowDetails(false); }}
                  className="flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl py-2.5 text-xs font-semibold text-rose-500 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative flex items-center space-x-3 ${className}`}>
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

      {/* Error Toast */}
      {showError && error && (
        <div className="absolute top-12 right-0 w-64 p-3 bg-rose-500/95 text-white text-[10px] font-bold rounded-xl shadow-xl animate-in slide-in-from-top-2 duration-300 z-[100] border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
