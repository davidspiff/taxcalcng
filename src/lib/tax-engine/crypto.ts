import { CryptoTaxInput, CryptoTaxResult } from './types';
import taxRules from './tax-rules.json';

const rules2026 = taxRules.tax_regime_2026;

/**
 * Calculates tax on cryptocurrency/digital asset transactions under Nigeria Tax Act 2026.
 * 
 * IMPORTANT: Crypto gains are part of taxable income and subject to income tax.
 * Losses from digital assets can ONLY be offset against gains from digital assets (Section 27(6), 28(3)(iv)).
 */
export function calculateCryptoTax(input: CryptoTaxInput, isCompany: boolean = false): CryptoTaxResult {
  const { transactions } = input;

  let totalGains = 0;
  let totalLosses = 0;

  for (const tx of transactions) {
    const gain = (tx.sellPrice - tx.buyPrice) * tx.quantity;
    if (gain > 0) {
      totalGains += gain;
    } else {
      totalLosses += Math.abs(gain);
    }
  }

  // Losses from digital assets can ONLY be offset against gains from digital assets
  const netPosition = totalGains - totalLosses;
  const taxableAmount = Math.max(0, netPosition);
  
  let cgtDue: number;
  let taxNote: string;

  if (isCompany) {
    cgtDue = taxableAmount * rules2026.cgt.company_rate;
    taxNote = 'Company: Crypto gains taxed at CIT rate (30%)';
  } else {
    // For individuals, crypto gains are part of Total Income and taxed at PIT rates.
    cgtDue = 0; // Not calculated here; must be combined with other income
    taxNote = 'Individual: Crypto gains are added to Total Income and taxed at progressive PIT rates (up to 25%). See PIT calculator.';
  }

  const result: CryptoTaxResult = {
    totalGains,
    totalLosses,
    netPosition,
    cgtDue,
    taxNote,
  };

  // Add warning if there are losses
  if (totalLosses > 0) {
    result.warning = 'IMPORTANT: Losses from digital assets can ONLY be offset against gains from digital assets, NOT other income (Section 27(6), 28(3)(iv))';
  }

  return result;
}
