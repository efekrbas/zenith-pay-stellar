import { Keypair, TransactionBuilder, Networks, Asset, Operation, Horizon } from 'stellar-sdk';
import fs from 'fs';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const masterSecret = 'SCBMRKIOFL5RQ52Q7YHCNNZC3DO7D6ULT2PO5TIJMRR4GAGNTCYYWP42';
const masterPair = Keypair.fromSecret(masterSecret);
const recipient = 'GCLR74TDWOHXBBUVOUIGWAYOVQKQKVFB6K2UFNAGOBQJJRGNA7RAYI6S';
const ZenithUSDC = new Asset('USDC', 'GDH2NEFB6P2PZ5SCS3QRYWAAFVC6L4E7WVSU5FRCRZTT52VHXHY5KBTM');

async function fastSimulate() {
  console.log('--- FAST Zenith Pay User Simulation Started ---');
  
  const masterAccount = await server.loadAccount(masterPair.publicKey());
  const users = [];
  
  // 1. Create and Fund 30 Accounts in batches
  for (let batch = 0; batch < 3; batch++) {
    console.log(`Processing Batch ${batch + 1}/3...`);
    const txBuilder = new TransactionBuilder(masterAccount, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET
    });

    const batchUsers = [];
    for (let i = 0; i < 10; i++) {
      const user = Keypair.random();
      txBuilder.addOperation(Operation.createAccount({
        destination: user.publicKey(),
        startingBalance: '10'
      }));
      batchUsers.push(user);
    }

    const tx = txBuilder.setTimeout(60).build();
    tx.sign(masterPair);
    await server.submitTransaction(tx);
    users.push(...batchUsers);
    console.log(` Batch ${batch + 1} funded.`);
  }

  // 2. Add Trustlines and Pay for each user
  const logPath = 'c:\\Users\\medios\\Desktop\\zenith-pay-stellar\\data\\transactions.json';
  let logs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    try {
      console.log(`[${i+1}/30] Processing: ${user.publicKey()}`);
      const userAccount = await server.loadAccount(user.publicKey());
      const masterAccount = await server.loadAccount(masterPair.publicKey());
      
      const amount = (Math.random() * 5 + 5).toFixed(2);

      // We combine everything into one transaction if possible?
      // No, let's keep it separate for reliability
      
      // 1. User adds trust
      const trustTx = new TransactionBuilder(userAccount, { fee: '1000', networkPassphrase: Networks.TESTNET })
        .addOperation(Operation.changeTrust({ asset: ZenithUSDC }))
        .setTimeout(60).build();
      trustTx.sign(user);
      await server.submitTransaction(trustTx);

      // 2. Master funds User with Zenith USDC
      const fundTx = new TransactionBuilder(masterAccount, { fee: '1000', networkPassphrase: Networks.TESTNET })
        .addOperation(Operation.payment({
            destination: user.publicKey(),
            asset: ZenithUSDC,
            amount: amount
        }))
        .setTimeout(60).build();
      fundTx.sign(masterPair);
      await server.submitTransaction(fundTx);

      // 3. User pays Recipient
      const userAccountReloaded = await server.loadAccount(user.publicKey());
      const payTx = new TransactionBuilder(userAccountReloaded, { fee: '1000', networkPassphrase: Networks.TESTNET })
        .addOperation(Operation.payment({
            destination: recipient,
            asset: ZenithUSDC,
            amount: amount
        }))
        .setTimeout(60).build();
      payTx.sign(user);
      const result = await server.submitTransaction(payTx);
      
      logs.push({
        hash: result.hash,
        sender: user.publicKey(),
        recipient: recipient,
        amount: amount,
        asset: 'USDC',
        timestamp: new Date().toISOString()
      });
      
      fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
      console.log(` ✅ Success: ${result.hash}`);
      // Add delay to prevent sequence errors
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      if (e.response?.data?.extras?.result_codes) {
        console.error(` ❌ User ${i+1} failed:`, e.response.data.extras.result_codes);
      } else {
        console.error(` ❌ User ${i+1} failed:`, e.message);
      }
    }
  }

  console.log('--- FAST Simulation Complete ---');
  console.log('Verifiable list updated in transactions.json');
}

fastSimulate();
