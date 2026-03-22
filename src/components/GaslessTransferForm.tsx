'use client';

import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useAccountData } from '@/hooks/useAccountData';
import { horizonServer } from '@/lib/stellar/stellar';
import { getStellarErrorMessage } from '@/lib/stellar/error-handler';
import { Asset, Networks, TransactionBuilder, FeeBumpTransaction } from '@stellar/stellar-sdk';
import TransactionStatusModal from './TransactionStatusModal';
import { withErrorBoundary } from "@sentry/nextjs";

const GaslessTransferForm = () => {
  const { publicKey, signTransaction } = useWallet();
  const { refreshData } = useAccountData();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('native');
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal State
  const [modalState, setModalState] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [modalMessage, setModalMessage] = useState('');
  const [txHash, setTxHash] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !signTransaction) return;

    setIsLoading(true);
    setModalState('pending');
    setModalMessage('Preparing your gasless transfer...');

    try {
      const asset = selectedAsset === 'native' 
        ? Asset.native() 
        : new Asset(selectedAsset.split(':')[0], selectedAsset.split(':')[1]);

      // 1. Build the transaction on the client
      const account = await horizonServer.loadAccount(publicKey);
      const transaction = new TransactionBuilder(account, {
        fee: '100', // Base fee (will be sponsored)
        networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET,
      })
        .addOperation(Asset.native().payment({
          destination: recipient,
          amount: amount,
        }))
        .setTimeout(60)
        .build();

      // 2. Request user signature via Freighter
      const signedTx = await signTransaction(transaction.toXDR());
      
      // 3. Send to our sponsorship API
      setModalMessage('Sponsoring transaction fees...');
      const sponsorResponse = await fetch('/api/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionXdr: signedTx }),
      });

      if (!sponsorResponse.ok) {
        const errorData = await sponsorResponse.json();
        throw new Error(errorData.error || 'Sponsorship failed');
      }

      const { sponsoredXdr } = await sponsorResponse.json();

      // 4. Submit the sponsored transaction to the network
      setModalMessage('Submitting to Stellar network...');
      const result = await horizonServer.submitTransaction(
        TransactionBuilder.fromXDR(sponsoredXdr, process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET) as any
      );

      setTxHash(result.hash);
      setModalState('success');
      setModalMessage(`Your transfer of ${amount} ${selectedAsset === 'native' ? 'XLM' : selectedAsset.split(':')[0]} was successful.`);

      // 5. Index the transaction for history
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hash: result.hash,
            sender: publicKey,
            recipient: recipient,
            amount: amount,
            asset: selectedAsset === 'native' ? 'XLM' : selectedAsset.split(':')[0],
          }),
        });
      } catch (indexError) {
        console.error('Failed to index transaction:', indexError);
      }

      setRecipient('');
      setAmount('');
      refreshData();
    } catch (error: any) {
      console.error('Transfer failed:', error);
      setModalState('failed');
      setModalMessage(getStellarErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-12 max-w-2xl mx-auto shadow-2xl relative overflow-hidden group">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
        
        <form onSubmit={handleSubmit} className="space-y-8 relative">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Recipient Address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="G..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Asset</label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
              >
                <option value="native" className="bg-[#0f172a]">XLM (Native)</option>
                <option value="USDC:GA5ZSEJYB37JRC5AVCIAZDL2Y34I3S7H36Z2DKEV2K2G3GXS2XN6GZGA" className="bg-[#0f172a]">USDC</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.0000001"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !publicKey}
            className={`w-full py-5 rounded-2xl font-bold tracking-widest uppercase text-sm transition-all duration-300 shadow-xl shadow-primary/20 ${
              isLoading || !publicKey
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                : 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isLoading ? 'Processing...' : publicKey ? 'Confirm Gasless Transfer' : 'Connect Wallet First'}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed">
            By confirming, you agree to our terms. This transaction is <span className="text-primary font-bold">100% sponsored</span> by Zenith Pay.
          </p>
        </form>
      </div>

      <TransactionStatusModal
        isOpen={modalState !== 'idle'}
        state={modalState}
        message={modalMessage}
        txHash={txHash}
        onClose={() => setModalState('idle')}
      />
    </>
  );
};

export default withErrorBoundary(GaslessTransferForm, { 
  fallback: <div className="glass p-8 text-center text-red-400">Something went wrong with the transfer form.</div> 
});
