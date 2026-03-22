import { NextRequest, NextResponse } from 'next/server';
import { Keypair, TransactionBuilder } from 'stellar-sdk';
import { stellarConfig } from '@/lib/stellar/stellar';
import { isRateLimited } from '@/lib/rate-limiter';
import { validateSponsorship } from '@/lib/stellar/sponsor-validation';

/**
 * API Route: /api/sponsor
 * Acts as a Sponsoring Account by wrapping a transaction in a Fee Bump.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. IP-based Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { xdr } = await req.json();

    if (!xdr) {
      return NextResponse.json({ error: 'Transaction XDR is required.' }, { status: 400 });
    }

    const sponsorSecret = process.env.SPONSOR_SECRET_KEY?.trim();
    if (!sponsorSecret) {
      return NextResponse.json({ error: 'Sponsor key not configured on server.' }, { status: 500 });
    }

    const networkPassphrase = stellarConfig.networkPassphrase;
    let sponsorKeypair;
    try {
      sponsorKeypair = Keypair.fromSecret(sponsorSecret);
    } catch (e: any) {
      return NextResponse.json({ error: 'Sponsor key is invalid format.', details: e.message }, { status: 500 });
    }

    // 2. Parse and Validate the inner transaction
    let innerTx;
    try {
      innerTx = TransactionBuilder.fromXDR(xdr, networkPassphrase);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid XDR format or network mismatch.' }, { status: 400 });
    }

    // 3. Security Checks using validation helper
    // We cast to any for simplicity in this MVP context as stellar-sdk type compatibility can be finicky between versions
    const validation = validateSponsorship(innerTx as any);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: validation.status });
    }

    // 4. Build the Fee Bump transaction
    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      sponsorKeypair,
      '200', // Base fee in stroops for the fee bump itself
      innerTx as any,
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
