import { Horizon, Networks } from 'stellar-sdk';

/**
 * Stellar Network Configuration Utility
 * Manages connections to Horizon and provides network-specific constants.
 */

const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet';
const horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const networkPassphrase = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET;

// Initialize Horizon Server
export const horizonServer = new Horizon.Server(horizonUrl);

/**
 * Network details helper
 */
export const stellarConfig = {
  network,
  horizonUrl,
  networkPassphrase,
  isTestnet: network === 'testnet',
};

export default horizonServer;
