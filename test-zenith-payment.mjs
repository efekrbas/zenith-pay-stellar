import { Keypair, TransactionBuilder, Networks, Asset, Operation, Horizon } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const distributorSecret = 'SCBMRKIOFL5RQ52Q7YHCNNZC3DO7D6ULT2PO5TIJMRR4GAGNTCYYWP42';
const pair = Keypair.fromSecret(distributorSecret);

const recipientAddress = 'GCLR74TDWOHXBBUVOUIGWAYOVQKQKVFB6K2UFNAGOBQJJRGNA7RAYI6S';
const ZenithUSDC = new Asset('USDC', 'GDH2NEFB6P2PZ5SCS3QRYWAAFVC6L4E7WVSU5FRCRZTT52VHXHY5KBTM');

async function testPayment() {
  try {
    const account = await server.loadAccount(pair.publicKey());
    
    console.log('Testing Zenith USDC payment to recipient...');
    const tx = new TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(Operation.payment({
          destination: recipientAddress,
          asset: ZenithUSDC,
          amount: '5'
      }))
      .setTimeout(60)
      .build();

    tx.sign(pair);
    await server.submitTransaction(tx);
    console.log('SUCCESS! Payment was accepted by the network.');
  } catch (error) {
    console.error('STRICT ERROR CODES:', error.response?.data?.extras?.result_codes || error.message);
  }
}

testPayment();
