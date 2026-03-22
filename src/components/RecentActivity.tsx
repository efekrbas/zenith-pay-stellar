'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
  hash: string;
  sender: string;
  recipient: string;
  amount: string;
  asset: string;
  timestamp: string;
}

const RecentActivity = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // Poll for new transactions every 10 seconds
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address: string) => {
    if (!address) return '...';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-12 py-20 text-center glass border border-white/10 rounded-[2.5rem]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-white/5 rounded-full mb-4" />
          <div className="h-4 w-48 bg-white/5 rounded-full mb-2" />
          <div className="h-3 w-32 bg-white/5 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mt-16"
    >
      <div className="flex items-center justify-between mb-8 px-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Recent Activity</h2>
          <p className="text-gray-500 text-sm">Real-time indexed gasless transactions</p>
        </div>
        <button 
          onClick={fetchTransactions}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          title="Refresh history"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="glass border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {transactions.length === 0 ? (
          <div className="py-20 text-center text-gray-500 italic">
            No recent activity found. Make your first gasless transfer!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">Asset & Amount</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">Recipient</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">Time</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none text-right">Explorer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                <AnimatePresence mode="popLayout">
                  {transactions.slice(0, 10).map((tx, index) => (
                    <motion.tr 
                      key={tx.hash}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                            tx.asset === 'XLM' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                          }`}>
                            {tx.asset[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-bold">{tx.amount} <span className="text-gray-500 font-medium text-sm">{tx.asset}</span></div>
                            <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest opacity-60">Sponsored</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-gray-300 font-medium font-mono text-sm">{formatAddress(tx.recipient)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-gray-500 text-sm">{getTimeAgo(tx.timestamp)}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <a 
                          href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-primary hover:bg-primary hover:text-white hover:border-transparent transition-all group/link"
                        >
                          <span className="text-xs font-bold">Details</span>
                          <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivity;
