'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DetailedBreakdown, BreakdownSection } from '@/components/calculator/detailed-breakdown';
import { BreakdownRow } from '@/components/calculator/breakdown-row';
import { PDFDownloadButton } from '@/components/calculator/pdf-download-button';
import { PDFContent } from '@/lib/pdf-generator';
import { calculateCGT, formatCurrency, assetTypes, CGTInput, CGTResult } from '@/lib/tax-engine';
import { CitationTooltip } from '@/components/citation-tooltip';
import { Gift, Home, Info, Landmark, Layers, RefreshCcw, ShieldCheck, Tag, TrendingUp } from 'lucide-react';

const INITIAL_CGT_INPUTS: CGTInput = {
  assetType: 'shares',
  acquisitionCost: 5000000,
  disposalProceeds: 8000000,
  expenses: 0,
  isPrincipalResidence: false,
  isGift: false,
  isCompany: false,
  reinvestedInNigerianShares: false,
};

export default function CGTCalculatorPage() {
  const [inputs, setInputs] = useState<CGTInput>(INITIAL_CGT_INPUTS);

  const result = useMemo<CGTResult>(() => calculateCGT(inputs), [inputs]);

  const updateInput = (updates: Partial<CGTInput>) => {
    setInputs(prev => ({ ...prev, ...updates }));
  };

  const resetInputs = () => {
    setInputs(INITIAL_CGT_INPUTS);
  };

  // PDF content generator
  const generatePDFContent = (): PDFContent => {
    return {
      calculatorType: 'Capital Gains Tax (CGT)',
      generatedDate: new Date().toLocaleDateString('en-NG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      inputSummary: {
        title: 'Transaction Summary',
        rows: [
          { label: 'Asset Type', value: assetTypes.find(t => t.value === inputs.assetType)?.label || inputs.assetType },
          { label: 'Acquisition Cost', value: inputs.acquisitionCost, isCurrency: true },
          { label: 'Disposal Proceeds', value: inputs.disposalProceeds, isCurrency: true },
          { label: 'Disposal Expenses', value: inputs.expenses || 0, isCurrency: true },
          { label: 'Company Transaction', value: inputs.isCompany ? 'Yes' : 'No' },
        ],
      },
      breakdown: [
        {
          title: 'Gain Calculation',
          rows: [
            { label: 'Disposal Proceeds', value: result.disposalProceeds, isCurrency: true },
            { label: 'Less: Acquisition Cost', value: result.acquisitionCost, isCurrency: true, isDeduction: true },
            { label: 'Less: Allowable Expenses', value: result.expenses, isCurrency: true, isDeduction: true },
            { label: 'Gross Capital Gain', value: result.grossGain, isCurrency: true, isTotal: true },
          ],
        },
        {
          title: 'Exemptions & Chargeable Gain',
          rows: [
            { label: 'Exemptions Applied', value: result.exemptions.length > 0 ? result.exemptions.join(', ') : 'None' },
            { label: 'Chargeable Gain', value: result.chargeableGain, isCurrency: true, isTotal: true },
          ],
        },
      ],
      summary: {
        totalTax: result.cgtDue,
      },
      legalReferences: [
        'Section 40 - Allowable Expenses (Agent fees, legal costs)',
        'Section 54 - Gifts Exemption',
        'Section 51 - Principal Private Residence (Individual primary home)',
        'Section 34 - Share Disposal Relief (Nigerian company reinvestment)',
        'Section 53 - Motor Vehicle Exemption (Private cars)',
        'Integration: Gains are added to income for PIT (Individuals) or taxed at CIT rate (Companies)'
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
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Tag className="w-3.5 h-3.5" />
              Capital Assets
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Capital Gains <span className="text-primary">Tax</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Calculate tax on the profit from selling your assets under the <span className="text-amber-600 font-bold">2026 Tax Act</span> integrated regime.
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
                    <Tag className="w-6 h-6" />
                  </div>
                  Asset Details
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                <div>
                  <Label htmlFor="assetType" className="text-sm font-medium">Asset Category</Label>
                  <Select
                    value={inputs.assetType}
                    onValueChange={(v) => updateInput({ assetType: v as CGTInput['assetType'] })}
                  >
                    <SelectTrigger className="mt-1.5 h-11">
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="acquisition" className="text-xs font-semibold text-muted-foreground uppercase">Acquisition Cost</Label>
                    <CurrencyInput
                      id="acquisition"
                      value={inputs.acquisitionCost}
                      onChange={(v) => updateInput({ acquisitionCost: v })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disposal" className="text-xs font-semibold text-muted-foreground uppercase">Disposal Proceeds</Label>
                    <CurrencyInput
                      id="disposal"
                      value={inputs.disposalProceeds}
                      onChange={(v) => updateInput({ disposalProceeds: v })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="expenses" className="text-sm font-medium flex items-center gap-1">
                    Allowable Expenses
                    <CitationTooltip section="Section 40" title="Expenses" description="Legal, agent, and professional fees related to the disposal." />
                  </Label>
                  <CurrencyInput
                    id="expenses"
                    value={inputs.expenses || 0}
                    onChange={(v) => updateInput({ expenses: v })}
                  />
                </div>

                <div className="pt-4 border-t border-dashed space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Context & Exemptions</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                      <div className="flex items-center gap-3">
                        <Landmark className="w-4 h-4 text-[#1E3A5F]" />
                        <span className="text-sm font-medium">Is this a Company?</span>
                      </div>
                      <Switch checked={inputs.isCompany} onCheckedChange={(v) => updateInput({ isCompany: v })} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                      <div className="flex items-center gap-3">
                        <Gift className="w-4 h-4 text-[#1E3A5F]" />
                        <span className="text-sm font-medium">Disposed as a Gift?</span>
                      </div>
                      <Switch checked={inputs.isGift} onCheckedChange={(v) => updateInput({ isGift: v })} />
                    </div>

                    {inputs.assetType === 'land' && (
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                        <div className="flex items-center gap-3">
                          <Home className="w-4 h-4 text-[#1E3A5F]" />
                          <span className="text-sm font-medium">Principal Residence?</span>
                        </div>
                        <Switch checked={inputs.isPrincipalResidence} onCheckedChange={(v) => updateInput({ isPrincipalResidence: v })} />
                      </div>
                    )}

                    {inputs.assetType === 'shares' && (
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-4 h-4 text-[#1E3A5F]" />
                          <span className="text-sm font-medium">Reinvested in Nigeria?</span>
                        </div>
                        <Switch checked={inputs.reinvestedInNigerianShares} onCheckedChange={(v) => updateInput({ reinvestedInNigerianShares: v })} />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full text-muted-foreground" onClick={resetInputs}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={result.cgtDue + result.chargeableGain}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Status Banner */}
                  {result.isExempt ? (
                    <Card className="relative overflow-hidden border-0 shadow-2xl premium-gradient-emerald text-white">
                      <div className="absolute inset-0 vibrant-shimmer opacity-20" />
                      <CardContent className="p-10 relative flex flex-col items-center text-center">
                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white mb-6 border border-white/30 shadow-xl">
                          <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black mb-3 tracking-tight">FULL EXEMPTION APPLIED</h2>
                        <p className="text-base font-medium opacity-90 max-w-md">{result.exemptionReason}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="relative overflow-hidden border-0 shadow-2xl premium-gradient text-white">
                      <div className="absolute inset-0 vibrant-shimmer opacity-20" />
                      <CardContent className="p-10 text-center relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                          <Landmark className="w-32 h-32" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 block mb-4">Capital Gains Tax Due</span>
                        <h2 className="text-5xl md:text-6xl font-black font-mono text-emerald-300 tracking-tighter">
                          {formatCurrency(result.cgtDue)}
                        </h2>
                        <div className="mt-8 inline-flex items-center gap-3 text-xs font-bold bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2.5 rounded-2xl">
                          <Info className="w-4 h-4 text-emerald-300" />
                          <span>Integration method: {inputs.isCompany ? 'Company CIT Rate' : 'Individual PIT Bands'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4">
                     <Card className="bg-muted/30 border-transparent p-4 text-center">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Gross Gain</div>
                        <div className="text-xl font-bold text-foreground">{formatCurrency(result.grossGain)}</div>
                     </Card>
                     <Card className="bg-muted/30 border-transparent p-4 text-center">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Chargeable Base</div>
                        <div className="text-xl font-bold text-[#1E3A5F]">{formatCurrency(result.chargeableGain)}</div>
                     </Card>
                  </div>

                  {/* Detailed Breakdowns */}
                  <div className="space-y-3">
                    <DetailedBreakdown
                      title="Gain Computation"
                      description="From proceeds to raw capital gain"
                      icon={<TrendingUp className="w-4 h-4" />}
                      defaultOpen={true}
                    >
                      <BreakdownSection>
                         <BreakdownRow label="Disposal Proceeds" value={result.disposalProceeds} />
                         <BreakdownRow label="Acquisition Cost" value={result.acquisitionCost} indent={1} isDeduction variant="muted" />
                         <BreakdownRow label="Disposal Expenses" value={result.expenses} indent={1} isDeduction variant="muted" />
                         <BreakdownRow label="Gross Capital Gain" value={result.grossGain} isTotal />
                      </BreakdownSection>
                    </DetailedBreakdown>

                    <DetailedBreakdown
                      title="Exemptions & Integration"
                      description="Application of relief and tax methodology"
                      icon={<Layers className="w-4 h-4" />}
                    >
                      <BreakdownSection title="Reliefs Applied">
                        {result.exemptions.length > 0 ? (
                          result.exemptions.map((ex, i) => (
                            <BreakdownRow key={i} label={ex} value="Applied" isText variant="positive" />
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground py-2 italic">No specific exemptions triggered for this asset/context.</p>
                        )}
                      </BreakdownSection>
                      
                      <BreakdownSection title="Final Calculation" className="mt-4">
                        <BreakdownRow label="Gross Gain" value={result.grossGain} />
                        <BreakdownRow label="Less: Exemptions" value={result.grossGain - result.chargeableGain} isDeduction variant="muted" />
                        <BreakdownRow label="Chargeable Gain" value={result.chargeableGain} isTotal />
                        <BreakdownRow 
                          label="Tax Rate/Treatment" 
                          value={inputs.isCompany ? 'CIT 30%' : 'PIT Progressivity'} 
                          isText 
                          variant="highlight"
                          citation={{ section: "Part II & VIII", title: "Integration", description: "Chargeable gains are integrated into total income for relevant tax pools." }}
                        />
                      </BreakdownSection>
                    </DetailedBreakdown>
                  </div>

                  {/* PDF Export */}
                  <PDFDownloadButton 
                    content={generatePDFContent()}
                    className="w-full h-12 text-base shadow-sm border-[#1E3A5F] text-[#1E3A5F]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Legal Context */}
        <Card className="mt-12 bg-amber-50/50 border-amber-100 p-6">
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-amber-900 font-bold mb-1">Integration of Capital Gains</h4>
                <p className="text-sm text-amber-800/80 leading-relaxed">
                  Under the 2026 Tax Act, Capital Gains Tax is no longer a separate fixed rate for all. 
                  Gains are integrated into the total income pool. For individuals, this means gains are added to other income 
                  and taxed at your marginal Personal Income Tax (PIT) rate. For companies, gains are taxed at the higher 
                  Company Income Tax (CIT) rate in line with the transparency principle.
                </p>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
