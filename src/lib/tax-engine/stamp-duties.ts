import { StampDutyInput, StampDutyResult } from './types';
import taxRules from './tax-rules.json';

const stampDuties = taxRules.stamp_duties;

type InstrumentType = 'bank_transfer' | 'tenancy_short' | 'tenancy_long' | 'mortgage' | 'share_capital' | 'loan_capital' | 'conveyance' | 'securities' | 'bill_of_exchange' | 'mineral_assets';

const instrumentConfig: Record<InstrumentType, { rate: number | 'flat'; payableBy: string; flatAmount?: number }> = {
  bank_transfer: { rate: 'flat', payableBy: 'Transferor', flatAmount: stampDuties.bank_transfer_flat },
  tenancy_short: { rate: stampDuties.tenancy_lease_up_to_7_years, payableBy: 'Lessee' },
  tenancy_long: { rate: stampDuties.tenancy_lease_above_7_years, payableBy: 'Lessee' },
  mortgage: { rate: stampDuties.mortgage, payableBy: 'Mortgagor' },
  share_capital: { rate: stampDuties.share_capital, payableBy: 'Company' },
  loan_capital: { rate: stampDuties.loan_capital, payableBy: 'Borrower' },
  conveyance: { rate: stampDuties.conveyance_sale, payableBy: 'Purchaser' },
  securities: { rate: stampDuties.marketable_securities, payableBy: 'Seller' },
  bill_of_exchange: { rate: stampDuties.bill_of_exchange, payableBy: 'Payee' },
  mineral_assets: { rate: stampDuties.transfer_mineral_assets, payableBy: 'Transferee' },
};

export function calculateStampDuty(input: StampDutyInput): StampDutyResult {
  const { instrumentType, value } = input;
  const config = instrumentConfig[instrumentType as InstrumentType];

  if (!config) {
    return {
      instrumentType: instrumentType,
      value,
      rate: 'N/A',
      dutyAmount: 0,
      payableBy: 'N/A',
      isExempt: false,
    };
  }

  // Check exemptions
  if (instrumentType === 'bank_transfer' && value < stampDuties.bank_transfer_threshold) {
    return {
      instrumentType: getInstrumentLabel(instrumentType),
      value,
      rate: 'Exempt',
      dutyAmount: 0,
      payableBy: config.payableBy,
      isExempt: true,
      exemptionReason: `Transfers below ₦${stampDuties.bank_transfer_threshold.toLocaleString()} are exempt (Section 185)`,
    };
  }
  
  // Tenancy/Lease exemption threshold: annual value below ₦10,000,000 or 10x annual minimum wage, whichever is higher
  if ((instrumentType === 'tenancy_short' || instrumentType === 'tenancy_long')) {
    const annualMinWage = taxRules.tax_regime_2026.pit.minimum_wage_amount * 12;
    const leaseExemptThreshold = Math.max(10_000_000, annualMinWage * 10);
    if (value < leaseExemptThreshold) {
      return {
        instrumentType: getInstrumentLabel(instrumentType),
        value,
        rate: 'Exempt',
        dutyAmount: 0,
        payableBy: config.payableBy,
        isExempt: true,
        exemptionReason: `Lease annual value below ₦${leaseExemptThreshold.toLocaleString()} is exempt (Section 134)`,
      };
    }
  }

  let dutyAmount: number;
  let rate: number | string;

  if (config.rate === 'flat') {
    dutyAmount = config.flatAmount!;
    rate = `₦${config.flatAmount} flat`;
  } else {
    dutyAmount = value * config.rate;
    rate = config.rate * 100;
  }

  return {
    instrumentType: getInstrumentLabel(instrumentType),
    value,
    rate,
    dutyAmount,
    payableBy: config.payableBy,
    isExempt: false,
  };
}

function getInstrumentLabel(type: string): string {
  const labels: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    tenancy_short: 'Tenancy/Lease (Up to 7 years)',
    tenancy_long: 'Tenancy/Lease (Above 7 years)',
    mortgage: 'Mortgage',
    share_capital: 'Share Capital',
    loan_capital: 'Loan Capital',
    conveyance: 'Conveyance/Sale',
    securities: 'Marketable Securities',
    bill_of_exchange: 'Bill of Exchange',
    mineral_assets: 'Transfer of Mineral Assets',
  };
  return labels[type] || type;
}

export const instrumentTypes = [
  { value: 'bank_transfer', label: 'Bank Transfer (₦10,000+)' },
  { value: 'tenancy_short', label: 'Tenancy/Lease (Up to 7 years)' },
  { value: 'tenancy_long', label: 'Tenancy/Lease (Above 7 years)' },
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'share_capital', label: 'Share Capital' },
  { value: 'loan_capital', label: 'Loan Capital' },
  { value: 'conveyance', label: 'Conveyance/Sale of Property' },
  { value: 'securities', label: 'Marketable Securities' },
  { value: 'bill_of_exchange', label: 'Bill of Exchange' },
  { value: 'mineral_assets', label: 'Transfer of Mineral Assets' },
];
