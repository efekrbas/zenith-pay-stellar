import { Horizon, Asset } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const USDC_ISSUER = 'GA2BYV7QJ75ZAZXQBEDX5CAYXIRMXELJYRK5O6IHF2RLCDKVQU2ZSKBU';

async function checkLiquidity() {
  try {
    const asset = new Asset('USDC', USDC_ISSUER);
    const book = await server.orderbook(Asset.native(), asset).call();
    console.log(`Orderbook for USDC:${USDC_ISSUER}:`);
    console.log(`- Bids: ${book.bids.length}`);
    console.log(`- Asks: ${book.asks.length}`);
    
    if (book.bids.length === 0) {
      console.log('NO LIQUIDITY! Users cannot easily swap for this asset.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkLiquidity();
