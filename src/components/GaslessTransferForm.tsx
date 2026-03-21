'use client';

import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useAccountData } from '@/hooks/useAccountData';
import { horizonServer } from '@/lib/stellar/stellar';
import { getStellarErrorMessage } from '@/lib/stellar/error-handler';
import { TransactionBuilder, Operation, Asset, Networks } from 'stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const GaslessTransferForm = () => {
  const { publicKey, isConnected } = useWallet();
  const { balances, refresh } = useAccountData();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('native'); // 'native' for XLM
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      setStatus({ type: 'error', message: 'Please connect your wallet first.' });
      return;
    }

    setLoading(true);
    setStatus({ type: 'info', message: 'Preparing transaction...' });

    try {
      // 1. Load account to get sequence number
      const account = await horizonServer.loadAccount(publicKey);
      
      // 2. Build the inner transaction
      const asset = selectedAsset === 'native' 
        ? Asset.native() 
        : new Asset(selectedAsset.split(':')[0], selectedAsset.split(':')[1]);

      const transaction = new TransactionBuilder(account, {
        fee: '100', // Inner transaction still needs a fee, but sponsor will pay it
        networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: recipient,
            asset,
            amount,
          })
        )
        .setTimeout(60 * 5) // 5 minutes
        .build();

      // 3. Sign with Freighter
      setStatus({ type: 'info', message: 'Waiting for wallet signature...' });
      const signedXdr = await signTransaction(transaction.toXDR(), {
        networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET,
      });

      // 4. Send to Sponsorship API
      setStatus({ type: 'info', message: 'Sponsoring transaction fees...' });
      const sponsorResponse = await fetch('/api/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xdr: signedXdr }),
      });

      const { xdr: sponsoredXdr, error: sponsorError } = await sponsorResponse.json();

      if (sponsorError) {
        throw new Error(`Sponsorship failed: ${sponsorError}`);
      }

      // 5. Submit to Horizon
      setStatus({ type: 'info', message: 'Submitting to network...' });
      const result = await horizonServer.submitTransaction(
        TransactionBuilder.fromXDR(sponsoredXdr, process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET)
      );

      console.log('Transaction success:', result);
      setStatus({ type: 'success', message: `Transfer successful! Hash: ${result.hash.slice(0, 8)}...` });
      setRecipient('');
      setAmount('');
      refresh();
    } catch (err: any) {
      console.error('Transfer error:', err);
      setStatus({ type: 'error', message: getStellarErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto glass border border-white/10 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2">Gasless Transfer</h2>
      <p className="text-gray-400 text-sm mb-6">Send assets instantly. We cover the network fees.</p>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Recipient Address</label>
          <input 
            type="text" 
            placeholder="G..." 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Asset</label>
            <select 
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="native" className="bg-slate-900 text-white">XLM (Native)</option>
              {balances.filter(b => b.asset_type !== 'native').map((balance, index) => (
                <option 
                  key={index} 
                  value={`${balance.asset_code}:${balance.asset_issuer}`}
                  className="bg-slate-900 text-white"
                >
                  {balance.asset_code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Amount</label>
            <input 
              type="number" 
              step="0.0000001"
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>
        </div>

        {status && (
          <div className={`p-4 rounded-xl text-sm ${
            status.type === 'error' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
            status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
            'bg-primary/10 text-primary border border-primary/20'
          }`}>
            <div className="flex items-center gap-2">
              {loading && status.type === 'info' && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {status.message}
            </div>
          </div>
        )}

        <button 
          type="submit"
          disabled={loading || !isConnected}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 mt-2 active:scale-[0.98]"
        >
          {loading ? 'Processing...' : 'Send Gasless Payment'}
        </button>
      </form>
    </div>
  );
};

export default GaslessTransferForm;
