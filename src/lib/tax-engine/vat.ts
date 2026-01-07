import { VATInput, VATResult } from './types';
import taxRules from './tax-rules.json';

const vatRate = taxRules.tax_regime_2026.vat_rate;

export function calculateVAT(input: VATInput): VATResult {
  const { supplyValue, supplyType, inputTaxCredit = 0, isNonResidentSupplier = false, isWithheldByCustomer = false } = input;

  let outputVAT = 0;
  let effectiveRate = 0;

  switch (supplyType) {
    case 'taxable':
      outputVAT = supplyValue * vatRate;
      effectiveRate = vatRate;
      break;
    case 'zero-rated':
      outputVAT = 0;
      effectiveRate = 0;
      break;
    case 'exempt':
      outputVAT = 0;
      effectiveRate = 0;
      break;
  }

  let netVATPayable = Math.max(0, outputVAT - inputTaxCredit);
  if (supplyType === 'taxable' && isNonResidentSupplier && isWithheldByCustomer) {
    netVATPayable = 0;
  }

  return {
    supplyValue,
    supplyType,
    vatRate: effectiveRate * 100,
    outputVAT,
    inputTaxCredit,
    netVATPayable,
  };
}

export const exemptSupplies = [
  'Oil and gas exports',
  'Baby products',
  'Sanitary towels/pads (locally manufactured)',
  'Military hardware',
  'Shared passenger road transport',
  'Agricultural equipment (tractors, ploughs)',
  'Land and buildings',
  'Government licences',
  'Assistive devices (wheelchairs, hearing aids, braille materials)',
];

export const zeroRatedSupplies = [
  'Basic food items',
  'Medical and pharmaceutical products',
  'Educational books and materials',
  'Fertilizers',
  'Agricultural chemicals, veterinary medicine, animal feeds',
  'Agricultural seeds and seedlings',
  'Medical services',
  'Tuition (nursery to tertiary)',
  'Exported goods and services',
  'Electric vehicles and parts',
];
