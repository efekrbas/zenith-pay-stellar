import { Keypair, TransactionBuilder, Networks, Asset, Operation, Horizon } from 'stellar-sdk';
import axios from 'axios';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function createZenithUSDC() {
  try {
    // 1. Generate Issuer and Distributor
    const issuer = Keypair.random();
    const distributor = Keypair.fromSecret('SCBMRKIOFL5RQ52Q7YHCNNZC3DO7D6ULT2PO5TIJMRR4GAGNTCYYWP42'); // Using the Recipient account as distributor
    
    console.log('Zenith USDC Issuer:', issuer.publicKey());
    console.log('Zenith USDC Distributor (Recipient):', distributor.publicKey());

    // 2. Fund Issuer via Friendbot
    console.log('Funding issuer via Friendbot...');
    await axios.get(`https://friendbot.stellar.org?addr=${issuer.publicKey()}`);

    // 3. User adds trustline (we'll ask the user to do this)
    // For now, let's just create the asset for the Distributor
    const ZenithUSDC = new Asset('USDC', issuer.publicKey());
    
    const distributorAccount = await server.loadAccount(distributor.publicKey());
    const setupTx = new TransactionBuilder(distributorAccount, {
        fee: '1000',
        networkPassphrase: Networks.TESTNET
    })
    .addOperation(Operation.changeTrust({ asset: ZenithUSDC }))
    .addOperation(Operation.payment({
        source: issuer.publicKey(),
        destination: distributor.publicKey(),
        asset: ZenithUSDC,
        amount: '1000000' // Mint 1M USDC
    }))
    .setTimeout(60)
    .build();

    setupTx.sign(issuer);
    setupTx.sign(distributor);
    await server.submitTransaction(setupTx);
    
    console.log('SUCCESS! 1,000,000 Zenith USDC minted to Distributor.');
    console.log('New Asset:', `USDC:${issuer.publicKey()}`);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createZenithUSDC();
