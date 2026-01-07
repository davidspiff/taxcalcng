import { PITInput, PITResult, PITComparisonResult, TaxBand } from './types';
import taxRules from './tax-rules.json';

const rules2026 = taxRules.tax_regime_2026;
const rulesOld = taxRules.tax_regime_old;

function calculateTaxByBands(taxableIncome: number, bands: TaxBand[]): { band: string; amount: number; tax: number; rate: number }[] {
  const result: { band: string; amount: number; tax: number; rate: number }[] = [];
  let remainingIncome = taxableIncome;

  for (const band of bands) {
    if (remainingIncome <= 0) break;

    const bandMin = band.min;
    const bandMax = band.max ?? Infinity;
    const bandWidth = bandMax - bandMin + 1;
    const amountInBand = Math.min(remainingIncome, bandWidth);
    const taxInBand = amountInBand * band.rate;

    if (amountInBand > 0) {
      result.push({
        band: band.max ? `₦${bandMin.toLocaleString()} - ₦${bandMax.toLocaleString()}` : `Above ₦${(bandMin - 1).toLocaleString()}`,
        amount: amountInBand,
        tax: taxInBand,
        rate: band.rate * 100,
      });
    }

    remainingIncome -= amountInBand;
  }

  return result;
}

/**
 * Calculates PIT under the 2026 Tax Act
 */
export function calculatePIT(input: PITInput): PITResult {
  const {
    grossIncome,
    housingAllowance = 0,
    transportAllowance = 0,
    otherAllowances = 0,
    pensionContribution = 0,
    nhfContribution = 0,
    nhisContribution = 0,
    lifeInsurance = 0,
    annualRentPaid = 0,
    isMinimumWage = false,
    assistiveDevices = 0,
  } = input;

  // Check minimum wage exemption
  if (isMinimumWage || grossIncome <= rules2026.pit.minimum_wage_amount * 12) {
    return {
      grossIncome,
      totalAllowances: housingAllowance + transportAllowance + otherAllowances,
      totalDeductions: 0,
      rentRelief: 0,
      taxableIncome: 0,
      taxByBand: [],
      totalTax: 0,
      effectiveRate: 0,
      netIncome: grossIncome,
      monthlyTax: 0,
      monthlyNetIncome: grossIncome / 12,
    };
  }

  const totalAllowances = housingAllowance + transportAllowance + otherAllowances;
  const totalGrossIncome = grossIncome + totalAllowances;

  // Calculate deductions
  const statutoryDeductions = pensionContribution + nhfContribution + nhisContribution + lifeInsurance;
  
  // Rent relief: 20% of annual rent paid, capped at ₦500,000
  const rentRelief = Math.min(annualRentPaid * rules2026.deductions.rent_relief.rate, rules2026.deductions.rent_relief.cap);
  
  const totalDeductions = statutoryDeductions + rentRelief + assistiveDevices;
  const taxableIncome = Math.max(0, totalGrossIncome - totalDeductions);

  // Calculate tax by bands
  const taxByBand = calculateTaxByBands(taxableIncome, rules2026.pit.bands as TaxBand[]);
  const totalTax = taxByBand.reduce((sum, b) => sum + b.tax, 0);
  const effectiveRate = totalGrossIncome > 0 ? (totalTax / totalGrossIncome) * 100 : 0;
  const netIncome = totalGrossIncome - totalTax;

  return {
    grossIncome: totalGrossIncome,
    totalAllowances,
    totalDeductions,
    rentRelief,
    taxableIncome,
    taxByBand,
    totalTax,
    effectiveRate,
    netIncome,
    monthlyTax: totalTax / 12,
    monthlyNetIncome: netIncome / 12,
  };
}

/**
 * Calculates PIT under the Old Law regime
 */
export function calculatePITOld(input: PITInput): PITResult {
  const {
    grossIncome,
    housingAllowance = 0,
    transportAllowance = 0,
    otherAllowances = 0,
    pensionContribution = 0,
    nhfContribution = 0,
    nhisContribution = 0,
    lifeInsurance = 0,
  } = input;

  const totalAllowances = housingAllowance + transportAllowance + otherAllowances;
  const totalGrossIncome = grossIncome + totalAllowances;

  // Old Consolidated Relief Allowance: ₦200,000 or 1% of gross income (whichever is higher) + 20% of gross income
  const cra = Math.max(rulesOld.pit.consolidated_relief.fixed, totalGrossIncome * 0.01) + 
              (totalGrossIncome * rulesOld.pit.consolidated_relief.rate);
  
  const statutoryDeductions = pensionContribution + nhfContribution + nhisContribution + lifeInsurance;
  const totalDeductions = cra + statutoryDeductions;
  const taxableIncome = Math.max(0, totalGrossIncome - totalDeductions);

  // Calculate tax by bands
  const taxByBand = calculateTaxByBands(taxableIncome, rulesOld.pit.bands as TaxBand[]);
  const totalTax = taxByBand.reduce((sum, b) => sum + b.tax, 0);
  const effectiveRate = totalGrossIncome > 0 ? (totalTax / totalGrossIncome) * 100 : 0;
  const netIncome = totalGrossIncome - totalTax;

  return {
    grossIncome: totalGrossIncome,
    totalAllowances,
    totalDeductions,
    rentRelief: 0,
    taxableIncome,
    taxByBand,
    totalTax,
    effectiveRate,
    netIncome,
    monthlyTax: totalTax / 12,
    monthlyNetIncome: netIncome / 12,
  };
}

// Backward compatibility aliases
export { calculatePIT as calculatePIT2025, calculatePITOld as calculatePIT2024 };

export function comparePIT(input: PITInput): PITComparisonResult {
  const oldResult = calculatePITOld(input);
  const newResult = calculatePIT(input);
  const savings = oldResult.totalTax - newResult.totalTax;
  const savingsPercentage = oldResult.totalTax > 0 ? (savings / oldResult.totalTax) * 100 : 0;

  return {
    old: oldResult,
    new: newResult,
    savings,
    savingsPercentage,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}
