'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DetailedBreakdown, BreakdownSection } from '@/components/calculator/detailed-breakdown';
import { BreakdownRow, SummaryRow } from '@/components/calculator/breakdown-row';
import { PDFDownloadButton } from '@/components/calculator/pdf-download-button';
import { PDFContent } from '@/lib/pdf-generator';
import { calculateStampDuty, formatCurrency, instrumentTypes, StampDutyInput, StampDutyResult } from '@/lib/tax-engine';
import { CitationTooltip } from '@/components/citation-tooltip';
import { Calculator, Landmark, RefreshCcw, ShieldCheck, Stamp, TableProperties, UserCheck } from 'lucide-react';

const INITIAL_STAMP_INPUTS: StampDutyInput = {
  instrumentType: 'bank_transfer',
  value: 100000,
};

export default function StampDutiesPage() {
  const [inputs, setInputs] = useState<StampDutyInput>(INITIAL_STAMP_INPUTS);

  const result = useMemo<StampDutyResult>(() => calculateStampDuty(inputs), [inputs]);

  const updateInput = (updates: Partial<StampDutyInput>) => {
    setInputs(prev => ({ ...prev, ...updates }));
  };

  const resetInputs = () => {
    setInputs(INITIAL_STAMP_INPUTS);
  };

  // PDF content generator
  const generatePDFContent = (): PDFContent => {
    return {
      calculatorType: 'Stamp Duties',
      generatedDate: new Date().toLocaleDateString('en-NG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      inputSummary: {
        title: 'Document Details',
        rows: [
          { label: 'Instrument Type', value: instrumentTypes.find(t => t.value === inputs.instrumentType)?.label || inputs.instrumentType },
          { label: 'Transaction Value', value: inputs.value, isCurrency: true },
        ],
      },
      breakdown: [
        {
          title: 'Duty Computation',
          rows: [
            { label: 'Base Value', value: result.value, isCurrency: true },
            { label: 'Applicable Rate', value: typeof result.rate === 'number' ? `${result.rate}%` : result.rate },
            { label: 'Duty Amount', value: result.dutyAmount, isCurrency: true, isTotal: true },
          ],
        },
        {
          title: 'Legal Responsibility',
          rows: [
            { label: 'Payable By', value: result.payableBy },
            { label: 'Status', value: result.isExempt ? 'Exempt' : 'Dutiable' },
          ],
        },
      ],
      summary: {
        totalTax: result.dutyAmount,
      },
      legalReferences: [
        'Ninth Schedule - Schedule of Stamp Duty Rates',
        'Section 185 - General Exemptions',
        'Bank Transfer Threshold: ₦10,000 minimum for flat duty',
        'Duty Payer: Specific rules for each instrument type'
      ],
    };
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-950 border-b border-border/40 print:hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Stamp className="w-3.5 h-3.5" />
              Statutory Duties
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Stamp <span className="text-primary">Duties</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Calculate statutory duties on commercial and financial instruments under the <span className="text-purple-600 font-bold">2026 Tax Act</span>.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="glass-card border-border/40 shadow-xl overflow-hidden py-0 font-sans text-slate-900 dark:text-white">
              <CardHeader className="bg-primary/5 dark:bg-primary/10 pb-5 pt-8 px-8 border-b border-border/40">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                  <div className="p-2.5 bg-primary text-white rounded-xl shadow-lg ring-4 ring-primary/10">
                    <Stamp className="w-6 h-6" />
                  </div>
                  Instrument Details
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                <div>
                  <Label htmlFor="instrument" className="text-sm font-medium flex items-center gap-1">
                    Document/Transaction Type
                    <CitationTooltip section="Ninth Schedule" title="Category" description="Determines the fixed or ad-valorem rate applicable." />
                  </Label>
                  <Select
                    value={inputs.instrumentType}
                    onValueChange={(v) => updateInput({ instrumentType: v as StampDutyInput['instrumentType'] })}
                  >
                    <SelectTrigger className="mt-1.5 h-12">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {instrumentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="value" className="text-sm font-medium flex items-center gap-1">
                    Value to be Stamped
                    <CitationTooltip section="Ninth Schedule" title="Dutiable Value" description="Consideration, loan amount, or periodic rent." />
                  </Label>
                  <p className="text-[10px] text-muted-foreground mb-2">The total amount specified in the instrument</p>
                  <CurrencyInput
                    id="value"
                    value={inputs.value}
                    onChange={(v) => updateInput({ value: v })}
                    className="h-12 text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full text-muted-foreground" onClick={resetInputs}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Reset Calculator
            </Button>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={result.instrumentType + result.dutyAmount}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Primary Total */}
                  <Card className={`relative overflow-hidden border-0 shadow-2xl py-0 ${
                    result.isExempt 
                      ? 'premium-gradient-emerald text-white' 
                      : 'premium-gradient text-white'
                  }`}>
                    <div className="absolute inset-0 vibrant-shimmer opacity-20" />
                    <CardContent className="p-10 text-center relative z-10">
                      {result.isExempt ? (
                        <>
                           <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-white/30">
                              <ShieldCheck className="w-12 h-12 text-white" />
                           </div>
                           <h2 className="text-4xl font-black tracking-tight mb-4">STAMP DUTY EXEMPT</h2>
                           <p className="text-lg font-medium opacity-90 max-w-sm mx-auto leading-relaxed">{result.exemptionReason}</p>
                        </>
                      ) : (
                        <>
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 block mb-4">Total Stamp Duty Due</span>
                           <h2 className="text-5xl md:text-6xl font-black font-mono tracking-tighter text-emerald-300">
                             {formatCurrency(result.dutyAmount)}
                           </h2>
                           <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/10">
                             <UserCheck className="w-4 h-4 text-emerald-300" />
                             <span className="text-xs font-bold tracking-wide">Payable by: {result.payableBy}</span>
                           </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Summary Breakdowns */}
                  <div className="space-y-3">
                    <DetailedBreakdown
                      title="Duty Aggregation"
                      description="Calculation of statutory fees"
                      icon={<Calculator className="w-4 h-4" />}
                      defaultOpen={true}
                    >
                      <BreakdownSection>
                         <BreakdownRow label="Instrument Category" value={result.instrumentType} isText />
                         <BreakdownRow label="Base Value" value={result.value} indent={1} variant="muted" />
                         <BreakdownRow label="Rate Applied" value={typeof result.rate === 'number' ? `${result.rate}%` : result.rate} isText indent={1} variant="muted" />
                         
                         <SummaryRow 
                           label="Total Duty Payable" 
                           value={result.dutyAmount} 
                           variant={result.isExempt ? 'success' : 'default'}
                           className="mt-3"
                         />
                      </BreakdownSection>
                    </DetailedBreakdown>

                    <DetailedBreakdown
                      title="Legal Compliance"
                      description="Ninth Schedule requirements"
                      icon={<Landmark className="w-4 h-4" />}
                    >
                      <BreakdownSection>
                         <BreakdownRow label="Responsibility Pool" value={result.payableBy} isText />
                         <BreakdownRow label="Schedule Reference" value="Ninth Schedule" isText indent={1} variant="muted" />
                         
                         <div className="mt-4 p-4 bg-muted/40 rounded-xl border border-border/60">
                            <h5 className="text-xs font-bold text-[#1E3A5F] uppercase mb-2">Note on Remittance</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Stamp duties on electronic receipts and transfers of ₦10,000 and above are remitted to the 
                              FIRS (for companies) or the relevant State Internal Revenue Service (for individuals).
                            </p>
                         </div>
                      </BreakdownSection>
                    </DetailedBreakdown>
                  </div>

                  {/* PDF Export */}
                  <PDFDownloadButton 
                    content={generatePDFContent()}
                    className="w-full h-12 text-base font-bold shadow-sm border-[#1E3A5F] text-[#1E3A5F]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Rates Table Section */}
        <div className="mt-16 border-t pt-12">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2 bg-[#1E3A5F]/10 rounded-lg text-[#1E3A5F]">
                  <TableProperties className="w-6 h-6" />
               </div>
               <div>
                  <h2 className="text-2xl font-bold text-[#1E3A5F]">Ninth Schedule Rates</h2>
                  <p className="text-sm text-muted-foreground">Standardized rates for key instruments</p>
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { item: 'Bank Transfers (₦10k+)', rate: '₦50 Flat', by: 'Transferor' },
                 { item: 'Tenancy / Lease', rate: '0.78%', by: 'Lessee' },
                 { item: 'Mortgage Deed', rate: '0.375%', by: 'Mortgagor' },
                 { item: 'Share Capital', rate: '0.75%', by: 'Company' },
                 { item: 'Loan Capital', rate: '0.125%', by: 'Borrower' },
                 { item: 'Conveyance / Sale', rate: '1.5%', by: 'Purchaser' },
               ].map((rate, i) => (
                 <Card key={i} className="bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                       <div className="text-xs font-bold text-muted-foreground uppercase opacity-70 mb-1">{rate.item}</div>
                       <div className="flex justify-between items-end">
                          <div className="text-lg font-bold text-[#1E3A5F]">{rate.rate}</div>
                          <div className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">Paid by {rate.by}</div>
                       </div>
                    </CardContent>
                 </Card>
               ))}
            </div>

            {/* General Exemptions */}
            <Card className="mt-8 bg-emerald-50/50 border-emerald-100 overflow-hidden">
               <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-emerald-900 mb-1">General Exemptions (Section 185)</h4>
                       <p className="text-sm text-emerald-800/80 mb-3">The following transactions are generally exempt from electronic money transfer levy and stamp duties:</p>
                       <div className="flex flex-wrap gap-2">
                          {['Transfers < ₦10,000', 'Salary Payments', 'Self-Transfers', 'FIRS Remittances'].map(tag => (
                             <span key={tag} className="text-[10px] font-bold bg-white/80 border border-emerald-200 px-3 py-1 rounded-full text-emerald-700">
                                {tag}
                             </span>
                          ))}
                       </div>
                    </div>
                  </div>
               </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
