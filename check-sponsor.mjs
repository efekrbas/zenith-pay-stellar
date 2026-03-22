import { Horizon } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const sponsorAddress = 'GD67INE7UMTXJIFIIFDGLHSO4OASGFLMMCWAT3JXPORUYUPENNN4B26F';

async function checkSponsor() {
  try {
    const account = await server.loadAccount(sponsorAddress);
    console.log('Sponsor Balance:');
    account.balances.forEach(b => {
      console.log(`- ${b.asset_type === 'native' ? 'XLM' : b.asset_code}: ${b.balance}`);
    });
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('Sponsor account NOT FOUND on Testnet! Needs funding.');
    } else {
      console.error('Error fetching sponsor account:', error.message);
    }
  }
}

checkSponsor();
