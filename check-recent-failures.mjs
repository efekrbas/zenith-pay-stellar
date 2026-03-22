import { Horizon } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const userAddress = 'GCI4FVG5Q5IGW3IYFPKVNNNPASEDOXD43SWUYISRHLTNSFAWZJG4A7CJ';

async function checkFailures() {
  try {
    const txs = await server.transactions().forAccount(userAddress).limit(5).order('desc').call();
    console.log(`Checking last ${txs.records.length} transactions for ${userAddress}...`);
    
    txs.records.forEach(tx => {
      console.log(`- TX ${tx.id} | Success: ${tx.successful}`);
      if (!tx.successful) {
          // Note: In some Horizon versions, you need to use a separate call or it's in result_xdr
          console.log(`  Result XDR: ${tx.result_xdr}`);
      }
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkFailures();
