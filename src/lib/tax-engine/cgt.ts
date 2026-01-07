import { CGTInput, CGTResult } from './types';
import taxRules from './tax-rules.json';

const rules2026 = taxRules.tax_regime_2026;

/**
 * Calculates Capital Gains Tax under the Nigeria Tax Act 2026.
 * 
 * IMPORTANT: Under the 2026 Act, chargeable gains are integrated into income tax:
 * - For INDIVIDUALS: Gains are added to Total Income and taxed at progressive PIT rates.
 * - For COMPANIES: Gains are part of Total Profits and taxed at the CIT rate (30% or 15% effective).
 */
export function calculateCGT(input: CGTInput): CGTResult {
  const {
    assetType,
    acquisitionCost,
    disposalProceeds,
    expenses = 0,
    isPrincipalResidence = false,
    isGift = false,
    isCompany = false,
    reinvestedInNigerianShares = false,
  } = input;

  const grossGain = disposalProceeds - acquisitionCost - expenses;
  const exemptions: string[] = [];
  let isExempt = false;
  let exemptionReason: string | undefined;

  // Check exemptions
  if (isGift) {
    isExempt = true;
    exemptionReason = 'Gifts are exempt from CGT (Section 54)';
    exemptions.push('Gift exemption');
  }

  if (isPrincipalResidence && assetType === 'land') {
    isExempt = true;
    exemptionReason = 'Principal private residence - one-time lifetime exemption (Section 51)';
    exemptions.push('Principal residence exemption');
  }

  if (assetType === 'vehicle') {
    isExempt = true;
    exemptionReason = 'Motor vehicles - up to 2 private vehicles per year exempt (Section 53)';
    exemptions.push('Motor vehicle exemption');
  }

  // Personal chattels threshold: ₦5M or 3x annual minimum wage, whichever is higher
  const dynamicChattelThreshold = Math.max(
    rules2026.cgt.personal_chattels_threshold,
    (rules2026.pit.minimum_wage_amount * 12) * 3
  );
  if (assetType === 'chattels' && disposalProceeds < dynamicChattelThreshold) {
    isExempt = true;
    exemptionReason = `Personal chattels below ₦${dynamicChattelThreshold.toLocaleString()} exempt (Section 52)`;
    exemptions.push('Personal chattels exemption');
  }

  // Share disposal exemption: proceeds < ₦150M AND gains < ₦10M
  if (assetType === 'shares') {
    if (disposalProceeds < rules2026.cgt.share_exemption.proceeds_threshold && 
        grossGain < rules2026.cgt.share_exemption.gains_threshold) {
      isExempt = true;
      exemptionReason = 'Share disposal exemption - proceeds < ₦150M and gains < ₦10M (Section 34)';
      exemptions.push('Share disposal exemption');
    }
    
    if (reinvestedInNigerianShares && grossGain > 0) {
      isExempt = true;
      exemptionReason = 'Reinvestment relief - proceeds reinvested in Nigerian company shares (Section 34)';
      exemptions.push('Reinvestment relief');
    }
  }

  const chargeableGain = isExempt ? 0 : Math.max(0, grossGain);
  
  // Under 2026 Act: For companies, apply CIT rate. For individuals, gains are part of PIT.
  let cgtRate: number;
  let taxNote: string;
  let cgtDue: number;

  if (isCompany) {
    cgtRate = rules2026.cgt.company_rate;
    cgtDue = chargeableGain * cgtRate;
    taxNote = 'Company: Gains taxed at CIT rate (30%)';
  } else {
    // For individuals, the chargeable gain is added to Total Income and taxed at PIT rates.
    // This calculator shows the gain; actual tax depends on total income bracket.
    cgtRate = 0; // Indicates it's part of PIT
    cgtDue = 0; // Not calculated here; must be combined with other income
    taxNote = 'Individual: Gains are added to Total Income and taxed at progressive PIT rates (up to 25%). See PIT calculator.';
  }

  return {
    assetType,
    acquisitionCost,
    disposalProceeds,
    expenses,
    grossGain,
    exemptions,
    chargeableGain,
    cgtRate: isCompany ? cgtRate * 100 : 0,
    cgtDue,
    isExempt,
    exemptionReason,
    taxNote,
  };
}

export const assetTypes = [
  { value: 'land', label: 'Land/Property' },
  { value: 'shares', label: 'Shares/Securities' },
  { value: 'crypto', label: 'Cryptocurrency/Digital Assets' },
  { value: 'vehicle', label: 'Motor Vehicle' },
  { value: 'chattels', label: 'Personal Chattels' },
  { value: 'other', label: 'Other Assets' },
];
