'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DetailedBreakdown, BreakdownSection } from '@/components/calculator/detailed-breakdown';
import { BreakdownRow, SummaryRow } from '@/components/calculator/breakdown-row';
import { PDFDownloadButton } from '@/components/calculator/pdf-download-button';
import { PDFContent } from '@/lib/pdf-generator';
import { calculateVAT, formatCurrency, exemptSupplies, zeroRatedSupplies, VATInput, VATResult } from '@/lib/tax-engine';
import { CitationTooltip } from '@/components/citation-tooltip';
import { AlertCircle, CheckCircle2, Search, ShoppingCart, Calculator, RefreshCcw, Layers } from 'lucide-react';

const INITIAL_VAT_INPUTS: VATInput = {
  supplyValue: 1000000,
  supplyType: 'taxable',
  inputTaxCredit: 0,
};

export default function VATCalculatorPage() {
  const [inputs, setInputs] = useState<VATInput>(INITIAL_VAT_INPUTS);
  const [searchTerm, setSearchTerm] = useState('');

  const result = useMemo<VATResult>(() => calculateVAT(inputs), [inputs]);

  const updateInput = (updates: Partial<VATInput>) => {
    setInputs(prev => ({ ...prev, ...updates }));
  };

  const filteredExempt = exemptSupplies.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredZero = zeroRatedSupplies.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

  // PDF content generator
  const generatePDFContent = (): PDFContent => {
    return {
      calculatorType: 'Value Added Tax (VAT)',
      generatedDate: new Date().toLocaleDateString('en-NG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      inputSummary: {
        title: 'Transaction Details',
        rows: [
          { label: 'Supply Type', value: inputs.supplyType.toUpperCase() },
          { label: 'Supply Value', value: inputs.supplyValue, isCurrency: true },
          { label: 'Input Tax Credit', value: inputs.inputTaxCredit || 0, isCurrency: true },
        ],
      },
      breakdown: [
        {
          title: 'VAT Computation',
          rows: [
            { label: 'Sales/Output Value', value: result.supplyValue, isCurrency: true },
            { label: 'Standard Rate', value: `${result.vatRate}%` },
            { label: 'Gross Output VAT', value: result.outputVAT, isCurrency: true },
            { label: 'Allowable Input VAT Credit', value: result.inputTaxCredit, isCurrency: true, isDeduction: true },
            { label: 'Net VAT Payable', value: result.netVATPayable, isCurrency: true, isTotal: true },
          ],
        },
      ],
      summary: {
        totalTax: result.netVATPayable,
      },
      legalReferences: [
        'VAT Act Cap V1 LFN 2004 (as amended)',
        'Section 4 - VAT rate fixed at 7.5%',
        'Section 10 - Reverse Charge mechanisms for non-residents',
        'First & Second Schedules - Exempt and Zero-rated lists'
      ],
    };
  };

  const resetCalculator = () => {
    setInputs(INITIAL_VAT_INPUTS);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-950 border-b border-border/40 print:hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <ShoppingCart className="w-3.5 h-3.5" />
              Consumption Tax
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Value Added <span className="text-primary">Tax</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Calculate precisely how much VAT applies to your goods and services under the <span className="text-emerald-600 font-bold">2026 Tax Act</span>.
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
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  Supply Details
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                   {(['taxable', 'exempt', 'zero-rated'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => updateInput({ supplyType: type })}
                        className={`py-2 px-3 rounded-md text-xs font-bold transition-all ${
                          inputs.supplyType === type 
                            ? 'bg-white text-[#1E3A5F] shadow-sm' 
                            : 'text-muted-foreground hover:text-[#1E3A5F]'
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                   ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1 mb-2">
                       Supply Value (Gross)
                       <CitationTooltip section="Section 4" title="VAT Base" description="The total amount payable for the supply of goods or services." />
                    </Label>
                    <CurrencyInput 
                      value={inputs.supplyValue} 
                      onChange={(v) => updateInput({ supplyValue: v })} 
                      className="h-12 text-lg"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1 mb-2">
                       Input Tax Credit
                       <CitationTooltip section="Section 17" title="Input VAT" description="VAT paid on raw materials or goods purchased for resale." />
                    </Label>
                    <CurrencyInput 
                      value={inputs.inputTaxCredit || 0} 
                      onChange={(v) => updateInput({ inputTaxCredit: v })} 
                      className="h-12 text-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full text-muted-foreground" onClick={resetCalculator}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Reset Calculator
            </Button>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={result.supplyType + result.netVATPayable}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Primary Total */}
                  <Card className="relative border-0 shadow-2xl overflow-hidden premium-gradient text-white">
                    <div className="absolute inset-0 vibrant-shimmer opacity-20" />
                    <CardContent className="p-10 text-center relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 block mb-4">Net VAT Payable</span>
                      <h2 className="text-5xl md:text-6xl font-black font-mono text-white tracking-tighter">
                        {formatCurrency(result.netVATPayable)}
                      </h2>
                      <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/10">
                         <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                         <span className="text-xs font-bold tracking-wide">Standard Rate Applied: {result.vatRate}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summaries */}
                  <div className="space-y-3">
                    <DetailedBreakdown
                      title="VAT Analysis"
                      description="Output and Input aggregation"
                      icon={<Calculator className="w-4 h-4" />}
                      defaultOpen={true}
                    >
                      <BreakdownSection>
                         <BreakdownRow label="Gross Sales Value" value={result.supplyValue} isCurrency />
                         <BreakdownRow label="Supply Category" value={result.supplyType.toUpperCase()} isText indent={1} variant="muted" />
                         <BreakdownRow label="Output VAT" value={result.outputVAT} isCurrency indent={1} variant="muted" />
                         <BreakdownRow label="Input VAT Credit" value={result.inputTaxCredit} isDeduction indent={1} variant="negative" />
                         <SummaryRow label="Net VAT Due" value={result.netVATPayable} className="mt-4" />
                      </BreakdownSection>
                    </DetailedBreakdown>

                    <DetailedBreakdown
                      title="Legal Context"
                      description="Understanding the 2026 VAT Framework"
                      icon={<Layers className="w-4 h-4" />}
                    >
                       <div className="p-4 space-y-4">
                          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                             <h5 className="text-xs font-bold text-blue-900 uppercase mb-2">Nexus Rules</h5>
                             <p className="text-xs text-blue-800 leading-relaxed">
                                Under Section 10, foreign suppliers of digital services to Nigeria must register and collect VAT, 
                                even if they have no physical presence.
                             </p>
                          </div>
                       </div>
                    </DetailedBreakdown>
                  </div>

                  {/* Actions */}
                  <PDFDownloadButton 
                    content={generatePDFContent()}
                    className="w-full h-12 text-base font-bold shadow-sm border-[#1E3A5F] text-[#1E3A5F]"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category Finder */}
            <Card className="border-[#1E3A5F]/10 bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                   <Search className="w-4 h-4 text-primary" />
                   Category Finder
                </CardTitle>
                <div className="relative mt-2">
                   <Input 
                     placeholder="Search item (e.g. food, books, medical)..." 
                     className="pl-9 bg-white" 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   <div>
                      <h4 className="text-[10px] font-bold text-emerald-600 uppercase mb-3 flex items-center gap-1">
                         <CheckCircle2 className="w-3 h-3" /> Zero-Rated
                      </h4>
                      <div className="space-y-1.5">
                         {filteredZero.map(s => (
                           <div key={s} className="text-xs p-2 bg-emerald-50 rounded border border-emerald-100 text-emerald-800">{s}</div>
                         ))}
                      </div>
                   </div>
                   <div>
                      <h4 className="text-[10px] font-bold text-blue-600 uppercase mb-3 flex items-center gap-1">
                         <AlertCircle className="w-3 h-3" /> Exempt Items
                      </h4>
                      <div className="space-y-1.5">
                         {filteredExempt.map(s => (
                           <div key={s} className="text-xs p-2 bg-blue-50 rounded border border-blue-100 text-blue-800">{s}</div>
                         ))}
                      </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
