/**
 * Standardized error handling for Stellar Horizon errors.
 * Maps raw error codes to user-friendly messages.
 */

export const getStellarErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred.';

  // Check if it's a Horizon error with result_codes
  const resultCodes = error.response?.data?.extras?.result_codes;
  
  if (resultCodes) {
    const transactionCode = resultCodes.transaction;
    const operationsCodes = resultCodes.operations || [];

    // Transaction-level errors
    if (transactionCode === 'tx_bad_seq') {
      return 'Transaction sequence error. Please refresh and try again.';
    }
    if (transactionCode === 'tx_insufficient_balance') {
      return 'Insufficient XLM to cover transaction fees.';
    }
    if (transactionCode === 'tx_insufficient_fee') {
      return 'The fee provided is too low for the current network traffic.';
    }
    if (transactionCode === 'tx_too_late') {
      return 'The transaction expired. Please try again.';
    }
    if (transactionCode === 'tx_missing_operation') {
      return 'The transaction is missing operations.';
    }

    // Operation-level errors
    for (const opCode of operationsCodes) {
      if (opCode === 'op_low_reserve') {
        return 'Your account does not have enough XLM reserve for this operation.';
      }
      if (opCode === 'op_underfunded') {
        return 'Insufficient funds to complete this operation.';
      }
      if (opCode === 'op_no_trust') {
        return 'You do not have a trustline for this asset.';
      }
      if (opCode === 'op_no_destination') {
        return 'The destination account does not exist.';
      }
      if (opCode === 'op_not_authorized') {
        return 'You are not authorized to perform this operation.';
      }
      if (opCode === 'op_src_not_authorized') {
        return 'Source account is not authorized.';
      }
      if (opCode === 'op_cross_self') {
        return 'You cannot trade with yourself.';
      }
      if (opCode === 'op_limit_full') {
        return 'The trustline limit has been reached.';
      }
    }
  }

  // Handle HTTP status codes if result_codes are missing
  if (error.response) {
    const status = error.response.status;
    if (status === 404) return 'Resource not found on the Stellar network.';
    if (status === 400) return 'Invalid request sent to Horizon.';
    if (status === 500) return 'Horizon server error. Please try again later.';
    if (status === 429) return 'Rate limit exceeded. Please slow down.';
  }

  // Generic fallback
  return error.message || 'An unexpected error occurred while processing the transaction.';
};
