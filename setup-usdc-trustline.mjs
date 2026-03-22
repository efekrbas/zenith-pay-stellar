import { Keypair, TransactionBuilder, Networks, Asset, Operation, Horizon } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const recipientSecret = 'SCBMRKIOFL5RQ52Q7YHCNNZC3DO7D6ULT2PO5TIJMRR4GAGNTCYYWP42';
const pair = Keypair.fromSecret(recipientSecret);
const USDC_CODE = 'USDC';
const USDC_ISSUER = 'GA2BYV7QJ75ZAZXQBEDX5CAYXIRMXELJYRK5O6IHF2RLCDKVQU2ZSKBU';

async function setupUSDC() {
  try {
    const USDC_ASSET = new Asset(USDC_CODE, USDC_ISSUER);
    const account = await server.loadAccount(pair.publicKey());
    
    console.log('Adding trustline for ' + pair.publicKey());
    const tx = new TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(Operation.changeTrust({ asset: USDC_ASSET }))
      .setTimeout(60)
      .build();

    tx.sign(pair);
    await server.submitTransaction(tx);
    console.log('Trustline added successfully.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupUSDC();
