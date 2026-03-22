import { Keypair, TransactionBuilder, Networks, Asset, Operation, Horizon } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const distributorSecret = 'SCBMRKIOFL5RQ52Q7YHCNNZC3DO7D6ULT2PO5TIJMRR4GAGNTCYYWP42';
const distributorPair = Keypair.fromSecret(distributorSecret);

const userAddress = 'GCI4FVG5Q5IGW3IYFPKVNNNPASEDOXD43SWUYISRHLTNSFAWZJG4A7CJ';
const USDC_CODE = 'USDC';
const USDC_ISSUER = 'GDH2NEFB6P2PZ5SCS3QRYWAAFVC6L4E7WVSU5FRCRZTT52VHXHY5KBTM';
const ZenithUSDC = new Asset(USDC_CODE, USDC_ISSUER);

async function sendZenithUSDC() {
  try {
    const distributorAccount = await server.loadAccount(distributorPair.publicKey());
    
    console.log('Sending 1,000,000 Zenith USDC to ' + userAddress);
    const tx = new TransactionBuilder(distributorAccount, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(Operation.payment({
          destination: userAddress,
          asset: ZenithUSDC,
          amount: '1000000'
      }))
      .setTimeout(60)
      .build();

    tx.sign(distributorPair);
    await server.submitTransaction(tx);
    console.log('SUCCESS! 1,000,000 Zenith USDC sent successfully.');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

sendZenithUSDC();
