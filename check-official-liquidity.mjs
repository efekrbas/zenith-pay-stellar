import { Horizon, Asset } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const USDC_ISSUER = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

async function checkLiquidity() {
  try {
    const asset = new Asset('USDC', USDC_ISSUER);
    const book = await server.orderbook(Asset.native(), asset).call();
    console.log(`Orderbook for official USDC:${USDC_ISSUER}:`);
    console.log(`- Bids: ${book.bids.length}`);
    console.log(`- Asks: ${book.asks.length}`);
    
    if (book.bids.length > 0) {
      console.log('ACTIVE LIQUIDITY FOUND! This is the one to use.');
    } else {
      console.log('NO LIQUIDITY found for this one either.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkLiquidity();
