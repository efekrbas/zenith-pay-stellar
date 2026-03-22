import { Keypair, TransactionBuilder, Networks, Asset, Operation, Horizon } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const distributorSecret = 'SCBMRKIOFL5RQ52Q7YHCNNZC3DO7D6ULT2PO5TIJMRR4GAGNTCYYWP42';
const pair = Keypair.fromSecret(distributorSecret);

const USDC_CODE = 'USDC';
const USDC_ISSUER = 'GDH2NEFB6P2PZ5SCS3QRYWAAFVC6L4E7WVSU5FRCRZTT52VHXHY5KBTM';
const ZenithUSDC = new Asset(USDC_CODE, USDC_ISSUER);

async function setupMarket() {
  try {
    const account = await server.loadAccount(pair.publicKey());
    
    console.log('Distributor setting up a Sell Offer for Zenith USDC...');
    const tx = new TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(Operation.manageSellOffer({
          selling: ZenithUSDC,
          buying: Asset.native(),
          amount: '1000000',
          price: '0.000001',
          offerId: '0'
      }))
      .setTimeout(60)
      .build();

    tx.sign(pair);
    await server.submitTransaction(tx);
    console.log('SUCCESS! 1M Zenith USDC is now available on the market for 1 XLM total.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupMarket();
