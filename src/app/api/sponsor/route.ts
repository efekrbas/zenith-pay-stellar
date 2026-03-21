import { NextRequest, NextResponse } from 'next/server';
import { Keypair, TransactionBuilder, Networks } from 'stellar-sdk';

/**
 * API Route: /api/sponsor
 * Acts as a Sponsoring Account by wrapping a transaction in a Fee Bump.
 */
export async function POST(req: NextRequest) {
  try {
    const { xdr } = await req.json();

    if (!xdr) {
      return NextResponse.json({ error: 'Transaction XDR is required.' }, { status: 400 });
    }

    const sponsorSecret = process.env.SPONSOR_SECRET_KEY;
    if (!sponsorSecret) {
      return NextResponse.json({ error: 'Sponsor key not configured on server.' }, { status: 500 });
    }

    const networkPassphrase = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET;
    const sponsorKeypair = Keypair.fromSecret(sponsorSecret);

    // Parse the inner transaction
    const innerTx = TransactionBuilder.fromXDR(xdr, networkPassphrase);

    // Build the Fee Bump transaction
    // Note: baseFee should be at least the same as the inner transaction's fee + 100 stroops (or according to network rules)
    // We'll use a standard fee or attempt to derive it.
    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      sponsorKeypair,
      '200', // Base fee in stroops for the fee bump itself
      innerTx,
      networkPassphrase
    );

    // Sign with sponsor secret
    feeBumpTx.sign(sponsorKeypair);

    // Return the new XDR
    return NextResponse.json({
      xdr: feeBumpTx.toXDR(),
      network: networkPassphrase,
    });
  } catch (error: any) {
    console.error('Sponsorship error:', error);
    return NextResponse.json({ 
      error: 'Failed to sponsor transaction.',
      details: error.message 
    }, { status: 500 });
  }
}
