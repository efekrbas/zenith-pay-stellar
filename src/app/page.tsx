import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-medium text-secondary mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span>Powered by Stellar Network</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Global Payments <br />
            <span className="text-gradient">Redefined for Everyone</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
            Experience lightning-fast transactions, near-zero fees, and borderless finance with ZenithPay. The ultimate fintech solution built on the Stellar blockchain.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-primary/25 hover:scale-105 active:scale-95">
              Get Started Now
            </button>
            <Link href="https://stellar.org" target="_blank" className="w-full sm:w-auto glass hover:bg-white/5 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-white/10 flex items-center justify-center gap-2">
              Learn about Stellar
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logos or stats could go here */}
            <div className="flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-white">5s</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">Finality</span>
            </div>
            <div className="flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-white">$0.0001</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">Avg. Fee</span>
            </div>
            <div className="flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-white">100+</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">Assets</span>
            </div>
            <div className="flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-white">24/7</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">Availability</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
