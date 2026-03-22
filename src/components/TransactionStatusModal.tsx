'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ModalState = 'pending' | 'success' | 'failed' | 'idle';

interface TransactionStatusModalProps {
  isOpen: boolean;
  state: ModalState;
  message: string;
  txHash?: string;
  onClose: () => void;
}

const TransactionStatusModal: React.FC<TransactionStatusModalProps> = ({
  isOpen,
  state,
  message,
  txHash,
  onClose,
}) => {
  if (state === 'idle') return null;

  const overlayVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(8px)' },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const iconVariants = {
    pending: {
      rotate: 360,
      transition: { repeat: Infinity, duration: 2, ease: "linear" as const }
    },
    success: {
      scale: [0.8, 1.2, 1],
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
    failed: {
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={state !== 'pending' ? onClose : undefined}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-sm glass border border-white/10 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl shadow-black/50"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Background Glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 -translate-y-1/2 blur-[80px] rounded-full opacity-30 ${
              state === 'success' ? 'bg-emerald-500' : 
              state === 'failed' ? 'bg-rose-500' : 'bg-primary'
            }`} />

            <div className="relative flex flex-col items-center text-center">
              {/* Animated Icon */}
              <motion.div 
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl ${
                  state === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 
                  state === 'failed' ? 'bg-rose-500/20 text-rose-500' : 
                  'bg-primary/20 text-primary'
                }`}
                variants={iconVariants}
                animate={state}
              >
                {state === 'pending' && (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                {state === 'success' && (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {state === 'failed' && (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </motion.div>

              <h3 className="text-xl font-bold text-white mb-2">
                {state === 'pending' ? 'Processing Transaction' : 
                 state === 'success' ? 'Transfer Sent!' : 'Transfer Failed'}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {message}
              </p>

              {txHash && state === 'success' && (
                <a 
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mb-6 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-primary hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Explorer
                </a>
              )}

              {state !== 'pending' && (
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all active:scale-[0.98]"
                >
                  {state === 'success' ? 'Awesome!' : 'Close'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionStatusModal;
