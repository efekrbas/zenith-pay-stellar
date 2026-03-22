import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="glass border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-white">Z</div>
              <span className="text-xl font-bold tracking-tight text-white">Zenith<span className="text-secondary">Pay</span></span>
            </div>
            <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
              Experience the future of finance on the Stellar network. Fast, secure, and global payments for everyone.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-gray-400 hover:text-primary text-sm transition-colors">Dashboard</Link></li>
              <li><Link href="/transfer" className="text-gray-400 hover:text-primary text-sm transition-colors">Transactions</Link></li>
              <li><Link href="/transfer" className="text-gray-400 hover:text-primary text-sm transition-colors">Wallet</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="https://stellar.org" target="_blank" className="text-gray-400 hover:text-primary text-sm transition-colors">Stellar Network</Link></li>
              <li><Link href="https://github.com/efekrbas/zenith-pay-stellar/blob/main/USER_GUIDE.md" target="_blank" className="text-gray-400 hover:text-primary text-sm transition-colors">Documentation</Link></li>
              <li><Link href="https://discord.gg/stellardev" target="_blank" className="text-gray-400 hover:text-primary text-sm transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ZenithPay. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="https://github.com/efekrbas/zenith-pay-stellar/blob/main/SECURITY_CHECKLIST.md" target="_blank" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="https://github.com/efekrbas/zenith-pay-stellar/blob/main/SECURITY_CHECKLIST.md" target="_blank" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
