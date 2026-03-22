import { Keypair, TransactionBuilder, Networks, Asset, Operation, Horizon } from 'stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const sponsorSecret = 'SDZDX37AXWG33IQ5URW4XJYSZHFV6Y4MFDY26KA2RO6VVG2OOADJJH5U';
const sponsorPair = Keypair.fromSecret(sponsorSecret);

const userAddress = 'GCI4FVG5Q5IGW3IYFPKVNNNPASEDOXD43SWUYISRHLTNSFAWZJG4A7CJ';
const USDC_CODE = 'USDC';
const USDC_ISSUER = 'GA2BYV7QJ75ZAZXQBEDX5CAYXIRMXELJYRK5O6IHF2RLCDKVQU2ZSKBU';
const USDC_ASSET = new Asset(USDC_CODE, USDC_ISSUER);

async function fundUserWithUSDC() {
  try {
    const sponsorAccount = await server.loadAccount(sponsorPair.publicKey());
    
    // 1. Add trustline to Sponsor (if not exists)
    // 2. Local swap XLM -> USDC for Sponsor
    // 3. Send USDC to User
    
    console.log('Preparing to send USDC from Sponsor to User...');
    
    const tx = new TransactionBuilder(sponsorAccount, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(Operation.changeTrust({ asset: USDC_ASSET })) // Sponsor needs to trust USDC too
      .addOperation(Operation.pathPaymentStrictSend({
          sendAsset: Asset.native(),
          sendAmount: '50', // Send 50 XLM worth of USDC
          destination: sponsorPair.publicKey(),
          destAsset: USDC_ASSET,
          destMin: '1',
          path: []
      }))
      .addOperation(Operation.payment({
          destination: userAddress,
          asset: USDC_ASSET,
          amount: '100' // Try to send 100 USDC (adjusting based on swap result)
      }))
      .setTimeout(60)
      .build();

    tx.sign(sponsorPair);
    await server.submitTransaction(tx);
    console.log('Successfully sent USDC to user!');
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response?.data?.extras?.result_codes) {
        console.error('Result Codes:', error.response.data.extras.result_codes);
        if (error.response.data.extras.result_codes.operations.includes('op_no_trust')) {
            console.log('NOTE: User probably still needs to add the trustline in Freighter.');
        }
    }
  }
}

fundUserWithUSDC();
