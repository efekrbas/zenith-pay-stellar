import { Keypair, TransactionBuilder, Networks, Asset, Operation, Horizon } from 'stellar-sdk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const sponsorSecret = 'SCBMRKIOFL5RQ52Q7YHCNNZC3DO7D6ULT2PO5TIJMRR4GAGNTCYYWP42'; // Using the reciever account for simplicity in simulation
const sponsorPair = Keypair.fromSecret(sponsorSecret);
const recipient = 'GCLR74TDWOHXBBUVOUIGWAYOVQKQKVFB6K2UFNAGOBQJJRGNA7RAYI6S';

const ZenithUSDC = new Asset('USDC', 'GDH2NEFB6P2PZ5SCS3QRYWAAFVC6L4E7WVSU5FRCRZTT52VHXHY5KBTM');

async function simulateUsers() {
  const users = [];
  console.log('--- Zenith Pay User Simulation Started ---');

  for (let i = 1; i <= 30; i++) {
    try {
      const user = Keypair.random();
      console.log(`[${i}/30] Generating user: ${user.publicKey()}`);
      
      // 1. Fund via Friendbot with retries
      let funded = false;
      for (let retry = 0; retry < 3; retry++) {
        try {
          await axios.get(`https://friendbot.stellar.org/?addr=${user.publicKey()}`);
          funded = true;
          break;
        } catch (fError) {
          console.log(`    Retry ${retry+1} for friendbot...`);
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      if (!funded) throw new Error('Friendbot funding failed after 3 attempts.');
      
      // 2. Setup Zenith USDC Trustline
      const userAccount = await server.loadAccount(user.publicKey());
      const trustTx = new TransactionBuilder(userAccount, {
        fee: '1000',
        networkPassphrase: Networks.TESTNET
      })
      .addOperation(Operation.changeTrust({ asset: ZenithUSDC }))
      .setTimeout(60)
      .build();
      
      trustTx.sign(user);
      await server.submitTransaction(trustTx);

      // 3. Perform a payment (Sponsoring ourself for the simulation)
      // Actually, we'll just do a standard payment from the user to the recipient
      const payTx = new TransactionBuilder(userAccount, {
        fee: '1000',
        networkPassphrase: Networks.TESTNET
      })
      .addOperation(Operation.payment({
        destination: recipient,
        asset: ZenithUSDC,
        amount: (Math.random() * 50 + 10).toFixed(2)
      }))
      .setTimeout(60)
      .build();

      payTx.sign(user);
      const result = await server.submitTransaction(payTx);
      console.log(` ✅ Success: ${result.hash}`);

      users.push({
        address: user.publicKey(),
        hash: result.hash,
        amount: payTx.operations[0].amount
      });

      // 4. Index the transaction for the Dashboard
      const logEntry = {
        hash: result.hash,
        sender: user.publicKey(),
        recipient: recipient,
        amount: payTx.operations[0].amount,
        asset: 'USDC',
        timestamp: new Date().toISOString()
      };

      const logPath = 'c:\\Users\\medios\\Desktop\\zenith-pay-stellar\\data\\transactions.json';
      let logs = [];
      if (fs.existsSync(logPath)) {
        logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      }
      logs.push(logEntry);
      fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

    } catch (error) {
      console.error(` ❌ Failed for user ${i}:`, error.message);
    }
    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('--- Simulation Complete ---');
  console.log('Verifiable User List:');
  users.forEach((u, idx) => console.log(`${idx+1}: ${u.address}`));
}

simulateUsers();
