import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, saveTransaction, TransactionMetadata } from '@/lib/stellar/indexer';

/**
 * API Route: /api/transactions
 * Handles storage and retrieval of recent transactions.
 */

export async function GET() {
  try {
    const transactions = await getTransactions();
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { hash, sender, recipient, amount, asset } = data;

    if (!hash || !sender || !recipient || !amount || !asset) {
      return NextResponse.json({ error: 'Missing required transaction fields' }, { status: 400 });
    }

    const tx: TransactionMetadata = {
      hash,
      sender,
      recipient,
      amount,
      asset,
      timestamp: new Date().toISOString(),
    };

    const success = await saveTransaction(tx);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to index transaction' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
