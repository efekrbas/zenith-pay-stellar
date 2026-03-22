import { Transaction, Networks, Operation } from 'stellar-sdk';

export const MAX_SPONSOR_AMOUNT = 1000;
export const ALLOWED_OPERATIONS = ['payment', 'pathPaymentStrictSend', 'pathPaymentStrictReceive'];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  status: number;
}

/**
 * Validates a transaction for sponsorship eligibility.
 * @param transaction The parsed Stellar transaction
 * @returns ValidationResult
 */
export function validateSponsorship(transaction: Transaction): ValidationResult {
  const operations = transaction.operations;

  // 1. Check for excessive counts
  if (operations.length > 5) {
    return { 
      isValid: false, 
      error: 'Too many operations in a single sponsored transaction.', 
      status: 400 
    };
  }

  // 2. Security Checks on Operations
  for (const op of operations) {
    // Allow only specific operation types
    if (!ALLOWED_OPERATIONS.includes(op.type)) {
      return { 
        isValid: false, 
        error: `Operation type '${op.type}' is not allowed for sponsorship.`, 
        status: 403 
      };
    }

    // Check for excessive amounts in payment/pathPayment
    // Note: op is typed as Operation, which might have different fields based on type
    const amountStr = (op as any).amount;
    if (amountStr) {
      const amount = parseFloat(amountStr);
      if (amount > MAX_SPONSOR_AMOUNT) {
        return { 
          isValid: false, 
          error: 'Transaction amount exceeds sponsorship limit.', 
          status: 403 
        };
      }
    }
  }

  return { isValid: true, status: 200 };
}
