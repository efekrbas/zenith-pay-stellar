import { Horizon } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function checkAccount(address) {
  try {
    const account = await server.loadAccount(address);
    console.log(`Balances for ${address}:`);
    account.balances.forEach(b => {
      const asset = b.asset_type === 'native' ? 'XLM' : `${b.asset_code}:${b.asset_issuer}`;
      console.log(`- ${asset}: ${b.balance}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const address = process.argv[2] || 'GCI4FVG5Q5IGW3IYFPKVNNNPASEDOXD43SWUYISRHLTNSFAWZJG4A7CJ';
checkAccount(address);
