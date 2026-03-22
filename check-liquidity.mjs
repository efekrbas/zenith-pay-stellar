import { Horizon, Asset } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function checkLiquidity() {
  try {
    const assets = await server.assets().forCode('USDC').call();
    console.log('Testing liquidity for USDC assets...');
    
    for (const asset of assets.records) {
      if (asset.amount === '0.0000000') continue;
      
      try {
          const book = await server.orderbook(Asset.native(), new Asset(asset.asset_code, asset.asset_issuer)).call();
          if (book.bids.length > 0) {
            console.log('ACTIVE ASSET FOUND: ' + asset.asset_code + ':' + asset.asset_issuer);
            console.log('Bids: ' + book.bids.length);
            return;
          }
      } catch (e) {
          // Skip if orderbook fails
      }
    }
    console.log('No USDC assets found with active orderbooks.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkLiquidity();
