'use client';

import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useAccountData } from '@/hooks/useAccountData';
import { horizonServer } from '@/lib/stellar/stellar';
import { getStellarErrorMessage } from '@/lib/stellar/error-handler';
import { TransactionBuilder, Operation, Asset, Networks } from 'stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';
import TransactionStatusModal, { ModalState } from './TransactionStatusModal';

const GaslessTransferForm = () => {
  const { publicKey, isConnected } = useWallet();
  const { balances, refresh } = useAccountData();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('native'); // 'native' for XLM
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>('idle');
  const [modalMessage, setModalMessage] = useState('');
  const [txHash, setTxHash] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      setModalState('failed');
      setModalMessage('Please connect your wallet first.');
      setModalOpen(true);
      return;
    }

    setLoading(true);
    setModalState('pending');
    setModalMessage('Initializing gasless transfer...');
    setModalOpen(true);

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
      setModalMessage('Waiting for wallet signature...');
      const signedXdr = await signTransaction(transaction.toXDR(), {
        networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET,
      });

      // 4. Send to Sponsorship API
      setModalMessage('Sponsoring transaction fees...');
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
      setModalMessage('Submitting to network...');
      const result = await horizonServer.submitTransaction(
        TransactionBuilder.fromXDR(sponsoredXdr, process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET)
      );

      console.log('Transaction success:', result);
      setTxHash(result.hash);
      setModalState('success');
      setModalMessage(`Your transfer of ${amount} ${selectedAsset === 'native' ? 'XLM' : selectedAsset.split(':')[0]} was successful.`);
      
      // Index the transaction
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hash: result.hash,
            sender: publicKey,
            recipient: recipient,
            amount: amount,
            asset: selectedAsset === 'native' ? 'XLM' : selectedAsset.split(':')[0]
          }),
        });
      } catch (indexError) {
        console.error('Failed to index transaction:', indexError);
        // Non-blocking error
      }

      setRecipient('');
      setAmount('');
      refresh();
    } catch (err: any) {
      console.error('Transfer error:', err);
      setModalState('failed');
      setModalMessage(getStellarErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto glass border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <h2 className="text-3xl font-bold text-white mb-2">Gasless Transfer</h2>
        <p className="text-gray-400 text-sm mb-8">Send assets fee-free. We cover the network costs.</p>

        <form onSubmit={handleTransfer} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Recipient Address</label>
            <input 
              type="text" 
              placeholder="G..." 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Asset</label>
              <div className="relative">
                <select 
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all appearance-none cursor-pointer"
                >
                  <option value="native" className="bg-slate-900 text-white">XLM</option>
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
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Amount</label>
              <input 
                type="number" 
                step="0.0000001"
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !isConnected}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-110 disabled:opacity-30 disabled:hover:brightness-100 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 mt-4 active:scale-[0.98] text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : 'Confirm Transfer'}
          </button>
        </form>
      </div>

      <TransactionStatusModal 
        isOpen={modalOpen}
        state={modalState}
        message={modalMessage}
        txHash={txHash}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default GaslessTransferForm;
