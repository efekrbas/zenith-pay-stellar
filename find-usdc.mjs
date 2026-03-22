import { Horizon } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function findUSDC() {
  try {
    console.log('Searching for USDC assets on Testnet...');
    // We can't search by code only easily without a lot of pages, 
    // but we can check the most common ones.
    
    // Let's try the Circle one if I can find it.
    // Actually, I'll just check what's available for 'USDC'
    const assets = await server.assets().forCode('USDC').call();
    
    if (assets.records.length > 0) {
      console.log('Found ' + assets.records.length + ' USDC assets:');
      assets.records.forEach(r => {
        console.log('- ' + r.asset_code + ':' + r.asset_issuer + ' (Amount: ' + r.amount + ')');
      });
    } else {
      console.log('No USDC assets found.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findUSDC();
