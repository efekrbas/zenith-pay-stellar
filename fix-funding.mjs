import { Keypair, TransactionBuilder, Networks, Asset, Operation, Horizon } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const distributorSecret = 'SCBMRKIOFL5RQ52Q7YHCNNZC3DO7D6ULT2PO5TIJMRR4GAGNTCYYWP42';
const distributorPair = Keypair.fromSecret(distributorSecret);

const userAddress = 'GCI4FVG5Q5IGW3IYFPKVNNNPASEDOXD43SWUYISRHLTNSFAWZJG4A7CJ';
const ZenithUSDC = new Asset('USDC', 'GDH2NEFB6P2PZ5SCS3QRYWAAFVC6L4E7WVSU5FRCRZTT52VHXHY5KBTM');

async function fixFunding() {
  try {
    const distributorAccount = await server.loadAccount(distributorPair.publicKey());
    
    // 1. Find the offer ID
    const offers = await server.offers().forAccount(distributorPair.publicKey()).call();
    console.log(`Found ${offers.records.length} offers.`);
    
    const txBuilder = new TransactionBuilder(distributorAccount, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET
    });

    // 2. Cancel all offers for ZenithUSDC
    offers.records.forEach(offer => {
       if (offer.selling.asset_code === 'USDC' && offer.selling.asset_issuer === 'GDH2NEFB6P2PZ5SCS3QRYWAAFVC6L4E7WVSU5FRCRZTT52VHXHY5KBTM') {
           console.log(`Cancelling offer ${offer.id}`);
           txBuilder.addOperation(Operation.manageSellOffer({
               selling: ZenithUSDC,
               buying: Asset.native(),
               amount: '0',
               price: offer.price,
               offerId: offer.id
           }));
       }
    });

    // 3. Send 1,000,000 USDC to user
    txBuilder.addOperation(Operation.payment({
        destination: userAddress,
        asset: ZenithUSDC,
        amount: '1000000'
    }));

    const tx = txBuilder.setTimeout(60).build();
    tx.sign(distributorPair);
    await server.submitTransaction(tx);
    console.log('SUCCESS! Offer cancelled and 1,000,000 Zenith USDC sent to user.');
  } catch (error) {
    console.error('Error:', error.response?.data?.extras?.result_codes || error.message);
  }
}

fixFunding();
