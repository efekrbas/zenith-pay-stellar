'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isConnected, getAddress } from '@stellar/freighter-api';

interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    try {
      const result = await isConnected();
      if (result.isConnected) {
        // Optional: restore session if needed
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const connectionStatus = await isConnected();
      if (!connectionStatus.isConnected) {
        throw new Error('Freighter extension not found. Please install it.');
      }

      const result = await getAddress();
      if (result.address) {
        setPublicKey(result.address);
        setIsWalletConnected(true);
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        throw new Error('Could not retrieve public key. Please unlock Freighter.');
      }
    } catch (err: any) {
      console.error('Connection failed:', err);
      setError(err.message || 'Failed to connect to Freighter.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setIsWalletConnected(false);
    setError(null);
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected: isWalletConnected,
        isConnecting,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
