import fs from 'fs';
import path from 'path';

export interface TransactionMetadata {
  hash: string;
  sender: string;
  recipient: string;
  amount: string;
  asset: string;
  timestamp: string;
}

const DATA_PATH = path.join(process.cwd(), 'data', 'transactions.json');

/**
 * Ensures the data directory exists.
 */
function ensureDirectory() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Reads transactions from the local JSON file.
 */
export async function getTransactions(): Promise<TransactionMetadata[]> {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading transactions:', error);
    return [];
  }
}

/**
 * Saves a new transaction to the local JSON file.
 */
export async function saveTransaction(tx: TransactionMetadata): Promise<boolean> {
  try {
    ensureDirectory();
    const transactions = await getTransactions();
    
    // Check if transaction already exists
    if (transactions.some(t => t.hash === tx.hash)) {
      return true;
    }

    transactions.unshift(tx); // Add to the beginning
    
    // Keep only the last 50 transactions for this lightweight version
    const limitedTransactions = transactions.slice(0, 50);
    
    fs.writeFileSync(DATA_PATH, JSON.stringify(limitedTransactions, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving transaction:', error);
    return false;
  }
}
