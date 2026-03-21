'use client';

import { useState, useEffect, useCallback } from 'react';
import { horizonServer } from '@/lib/stellar/stellar';
import { useWallet } from '@/context/WalletContext';
import { Horizon } from 'stellar-sdk';

export interface Balance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
  limit?: string;
  is_authorized?: boolean;
}

export const useAccountData = (pollInterval = 10000) => {
  const { publicKey, isConnected } = useWallet();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountData = useCallback(async () => {
    if (!publicKey || !isConnected) {
      setBalances([]);
      return;
    }

    setLoading(true);
    try {
      const account = await horizonServer.loadAccount(publicKey);
      // Horizon AccountResponse balances are properly typed in stellar-sdk
      setBalances(account.balances as unknown as Balance[]);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching account data:', err);
      if (err.response?.status === 404) {
        setError('Account not found on network. Please fund it with XLM.');
      } else {
        setError('Failed to fetch account data.');
      }
      setBalances([]);
    } finally {
      setLoading(false);
    }
  }, [publicKey, isConnected]);

  useEffect(() => {
    fetchAccountData();

    if (isConnected && publicKey) {
      const interval = setInterval(fetchAccountData, pollInterval);
      return () => clearInterval(interval);
    }
  }, [fetchAccountData, isConnected, publicKey, pollInterval]);

  const xlmBalance = balances.find((b) => b.asset_type === 'native')?.balance || '0';
  const customAssets = balances.filter((b) => b.asset_type !== 'native');

  return {
    balances,
    xlmBalance,
    customAssets,
    loading,
    error,
    refresh: fetchAccountData,
  };
};
