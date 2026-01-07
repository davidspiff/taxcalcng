import { CITInput, CITResult } from './types';
import taxRules from './tax-rules.json';

const rules2026 = taxRules.tax_regime_2026;

export function calculateCIT(input: CITInput): CITResult {
  const {
    turnover,
    assessableProfits,
    capitalAllowances = 0,
    rdDeductions = 0,
    isNonResident = false,
  } = input;

  // Determine company type based on turnover
  let companyType: 'small' | 'medium' | 'large';
  let citRate: number;

  if (turnover < rules2026.cit.small_company_threshold) {
    companyType = 'small';
    citRate = rules2026.cit.small_company_rate;
  } else {
    companyType = 'large';
    citRate = rules2026.cit.standard_rate;
  }

  const totalDeductions = capitalAllowances + rdDeductions;
  const taxableProfits = Math.max(0, assessableProfits - totalDeductions);
  const citAmount = taxableProfits * citRate;

  // Development Levy: 4% on assessable profits (excludes small companies and non-resident companies)
  const developmentLevy = (companyType === 'small' || isNonResident) ? 0 : assessableProfits * rules2026.development_levy_rate;

  // Check Minimum Effective Tax Rate (15%)
  const totalTaxBeforeTopUp = citAmount + developmentLevy;
  const effectiveTaxRate = assessableProfits > 0 ? totalTaxBeforeTopUp / assessableProfits : 0;
  
  let minimumTaxTopUp = 0;
  if (companyType !== 'small' && effectiveTaxRate < rules2026.cit.minimum_effective_rate) {
    const minimumTax = assessableProfits * rules2026.cit.minimum_effective_rate;
    minimumTaxTopUp = minimumTax - totalTaxBeforeTopUp;
  }

  const totalTaxBurden = citAmount + developmentLevy + minimumTaxTopUp;
  const finalEffectiveRate = assessableProfits > 0 ? (totalTaxBurden / assessableProfits) * 100 : 0;

  return {
    companyType,
    turnover,
    assessableProfits,
    totalDeductions,
    taxableProfits,
    citRate: citRate * 100,
    citAmount,
    developmentLevy,
    effectiveTaxRate: finalEffectiveRate,
    minimumTaxTopUp,
    totalTaxBurden,
    capitalAllowances,
    rdDeductions,
  };
}

export function getCompanyTypeLabel(type: 'small' | 'medium' | 'large'): string {
  const labels = {
    small: 'Small Company (0% CIT)',
    medium: 'Medium Company',
    large: 'Standard Company (30% CIT)',
  };
  return labels[type];
}
