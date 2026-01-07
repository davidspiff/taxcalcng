export interface TaxBand {
  min: number;
  max: number | null;
  rate: number;
}

export interface PITInput {
  grossIncome: number;
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowances?: number;
  pensionContribution?: number;
  nhfContribution?: number;
  nhisContribution?: number;
  lifeInsurance?: number;
  annualRentPaid?: number;
  isMinimumWage?: boolean;
  assistiveDevices?: number;
}

export interface PITResult {
  grossIncome: number;
  totalAllowances: number;
  totalDeductions: number;
  rentRelief: number;
  taxableIncome: number;
  taxByBand: { band: string; amount: number; tax: number; rate: number }[];
  totalTax: number;
  effectiveRate: number;
  netIncome: number;
  monthlyTax: number;
  monthlyNetIncome: number;
}

export interface PITComparisonResult {
  old: PITResult;
  new: PITResult;
  savings: number;
  savingsPercentage: number;
}

export interface CITInput {
  turnover: number;
  assessableProfits: number;
  capitalAllowances?: number;
  rdDeductions?: number;
  isNonResident?: boolean;
}

export interface CITResult {
  companyType: 'small' | 'medium' | 'large';
  turnover: number;
  assessableProfits: number;
  totalDeductions: number;
  taxableProfits: number;
  citRate: number;
  citAmount: number;
  developmentLevy: number;
  effectiveTaxRate: number;
  minimumTaxTopUp: number;
  totalTaxBurden: number;
  capitalAllowances?: number;
  rdDeductions?: number;
}

export interface CGTInput {
  assetType: 'land' | 'shares' | 'crypto' | 'vehicle' | 'chattels' | 'other';
  acquisitionCost: number;
  disposalProceeds: number;
  expenses?: number;
  isPrincipalResidence?: boolean;
  isGift?: boolean;
  isCompany?: boolean;
  reinvestedInNigerianShares?: boolean;
}

export interface CGTResult {
  assetType: string;
  acquisitionCost: number;
  disposalProceeds: number;
  expenses: number;
  grossGain: number;
  exemptions: string[];
  chargeableGain: number;
  cgtRate: number;
  cgtDue: number;
  isExempt: boolean;
  exemptionReason?: string;
  taxNote?: string;
}

export interface VATInput {
  supplyValue: number;
  supplyType: 'taxable' | 'exempt' | 'zero-rated';
  inputTaxCredit?: number;
  isNonResidentSupplier?: boolean;
  isWithheldByCustomer?: boolean;
}

export interface VATResult {
  supplyValue: number;
  supplyType: string;
  vatRate: number;
  outputVAT: number;
  inputTaxCredit: number;
  netVATPayable: number;
}

export interface StampDutyInput {
  instrumentType: 
    | 'bank_transfer' 
    | 'tenancy_short' 
    | 'tenancy_long' 
    | 'mortgage' 
    | 'share_capital' 
    | 'loan_capital' 
    | 'conveyance' 
    | 'securities'
    | 'bill_of_exchange'
    | 'mineral_assets';
  value: number;
}

export interface StampDutyResult {
  instrumentType: string;
  value: number;
  rate: number | string;
  dutyAmount: number;
  payableBy: string;
  isExempt: boolean;
  exemptionReason?: string;
}

export interface CryptoTaxInput {
  transactions: {
    buyPrice: number;
    sellPrice: number;
    quantity: number;
  }[];
}

export interface CryptoTaxResult {
  totalGains: number;
  totalLosses: number;
  netPosition: number;
  cgtDue: number;
  taxNote?: string;
  warning?: string;
}
