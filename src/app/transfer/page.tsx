'use client';

import React from 'react';
import GaslessTransferForm from '@/components/GaslessTransferForm';
import RecentActivity from '@/components/RecentActivity';

export default function TransferPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[calc(100vh-80px)] flex flex-col items-center">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Seamless <span className="text-gradient">Transfers</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          Send any Stellar asset anywhere in the world without worrying about transaction fees.
        </p>
      </div>
      
      <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <GaslessTransferForm />
      </div>

      <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-1200 mt-12">
        <RecentActivity />
      </div>

      {/* Decorative background elements */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </div>
  );
}
