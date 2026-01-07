'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DetailedBreakdown, BreakdownSection } from '@/components/calculator/detailed-breakdown';
import { BreakdownRow, SummaryRow } from '@/components/calculator/breakdown-row';
import { PDFDownloadButton } from '@/components/calculator/pdf-download-button';
import { PDFContent } from '@/lib/pdf-generator';
import { calculateCIT, getCompanyTypeLabel, CITInput, CITResult } from '@/lib/tax-engine';
import { CitationTooltip } from '@/components/citation-tooltip';
import { Building2, Calculator, Info, RefreshCcw, ShieldCheck, TrendingUp, Zap } from 'lucide-react';

const INITIAL_CIT_INPUTS: CITInput = {
  turnover: 30000000,
  assessableProfits: 5000000,
  capitalAllowances: 0,
  rdDeductions: 0,
  isNonResident: false,
};

export default function CITCalculatorPage() {
  const [inputs, setInputs] = useState<CITInput>(INITIAL_CIT_INPUTS);

  const result = useMemo<CITResult>(() => calculateCIT(inputs), [inputs]);

  const updateInput = (updates: Partial<CITInput>) => {
    setInputs(prev => ({ ...prev, ...updates }));
  };

  const resetInputs = () => {
    setInputs(INITIAL_CIT_INPUTS);
  };

  // PDF content generator
  const generatePDFContent = (): PDFContent => {
    return {
      calculatorType: 'Company Income Tax (CIT)',
      generatedDate: new Date().toLocaleDateString('en-NG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      inputSummary: {
        title: 'Input Summary',
        rows: [
          { label: 'Annual Turnover', value: inputs.turnover, isCurrency: true },
          { label: 'Assessable Profits', value: inputs.assessableProfits, isCurrency: true },
          { label: 'Capital Allowances', value: inputs.capitalAllowances || 0, isCurrency: true, isDeduction: true },
          { label: 'R&D Deductions', value: inputs.rdDeductions || 0, isCurrency: true, isDeduction: true },
          { label: 'Non-Resident Status', value: inputs.isNonResident ? 'Yes' : 'No' },
        ],
      },
      breakdown: [
        {
          title: 'Classification & Profitability',
          rows: [
            { label: 'Company Classification', value: getCompanyTypeLabel(result.companyType) },
            { label: 'Taxable Profits', value: result.taxableProfits, isCurrency: true, isTotal: true },
          ],
        },
        {
          title: 'Tax Components',
          rows: [
            { label: `CIT (${result.citRate}%)`, value: result.citAmount, isCurrency: true },
            { label: 'Development Levy (4%)', value: result.developmentLevy, isCurrency: true },
            { label: 'Minimum Tax Top-Up', value: result.minimumTaxTopUp, isCurrency: true },
            { label: 'Total Tax Burden', value: result.totalTaxBurden, isCurrency: true, isTotal: true },
          ],
        },
      ],
      summary: {
        totalTax: result.totalTaxBurden,
        effectiveRate: result.effectiveTaxRate,
      },
      legalReferences: [
        'Section 56 - CIT Rate (30% Standard, 0% Small)',
        'Section 59 - Development Levy (4% on Assessable Profits)',
        'Section 57 - Minimum Effective Tax Rate (15%)',
        'Section 165 - R&D Deductions',
        'Small Company Exemption: Turnover < ₦50M'
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
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Building2 className="w-3.5 h-3.5" />
              Corporate Tax
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Company Income <span className="text-primary">Tax</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Determine your company tax liability and classification under the <span className="text-blue-600 font-bold">2026 Tax Act</span>.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="glass-card border-border/40 shadow-xl overflow-hidden py-0 font-sans">
              <CardHeader className="bg-primary/5 dark:bg-primary/10 pb-5 pt-8 px-8 border-b border-border/40">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                  <div className="p-2.5 bg-primary text-white rounded-xl shadow-lg ring-4 ring-primary/10">
                    <Building2 className="w-6 h-6" />
                  </div>
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="turnover" className="text-sm font-medium flex items-center gap-1">
                      Annual Turnover
                      <CitationTooltip 
                        section="Section 56" 
                        title="Classification" 
                        description="Determines if you are a Small, Medium, or Large company."
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">Total revenue for the fiscal year</p>
                    <CurrencyInput
                      id="turnover"
                      value={inputs.turnover}
                      onChange={(v) => updateInput({ turnover: v })}
                      className="h-12 text-lg"
                    />
                    {inputs.turnover < 50000000 && (
                      <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Classified as Small Company (Tax Exempt)
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/60">
                    <div>
                      <Label className="text-sm font-medium">Non-Resident Company?</Label>
                      <p className="text-[10px] text-muted-foreground">Excludes Development Levy (Section 59)</p>
                    </div>
                    <Switch 
                      checked={inputs.isNonResident} 
                      onCheckedChange={(v) => updateInput({ isNonResident: v })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="profits" className="text-sm font-medium flex items-center gap-1">
                      Assessable Profits
                      <CitationTooltip 
                        section="Section 24" 
                        title="Taxable Profit Base" 
                        description="Profit after adding back non-deductible expenses and deducting capital allowances."
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">Adjusted profit for tax purposes</p>
                    <CurrencyInput
                      id="profits"
                      value={inputs.assessableProfits}
                      onChange={(v) => updateInput({ assessableProfits: v })}
                      className="h-12 text-lg"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Allowable Deductions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs flex items-center gap-1">
                        Capital Allowances
                        <CitationTooltip section="First Schedule" title="Depreciation" description="Tax relief on qualifying capital expenditure." />
                      </Label>
                      <CurrencyInput
                        value={inputs.capitalAllowances || 0}
                        onChange={(v) => updateInput({ capitalAllowances: v })}
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs flex items-center gap-1">
                        R&D Deductions
                        <CitationTooltip section="Section 165" title="Innovation" description="Expenses on research and development." />
                      </Label>
                      <CurrencyInput
                        value={inputs.rdDeductions || 0}
                        onChange={(v) => updateInput({ rdDeductions: v })}
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
                variant="outline" 
                className="w-full text-muted-foreground hover:text-[#1E3A5F]"
                onClick={resetInputs}
            >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reset Calculator
            </Button>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={result.totalTaxBurden}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Classification Tile */}
                  <Card className={`relative overflow-hidden border-0 shadow-2xl py-0 ${
                    result.companyType === 'small' 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
                      : 'premium-gradient text-white'
                  }`}>
                    <div className="absolute inset-0 vibrant-shimmer opacity-20" />
                    <CardContent className="p-10 relative flex flex-col items-center text-center">
                      <span className="text-xs uppercase tracking-[0.3em] font-black opacity-60 mb-4">Enterprise Classification</span>
                      <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">{getCompanyTypeLabel(result.companyType)}</h2>
                      {result.companyType === 'small' && (
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-white/20 backdrop-blur-md text-white text-sm font-bold border border-white/30 shadow-lg">
                          <Zap className="w-4 h-4 fill-white" />
                          CIT EXEMPT
                        </div>
                      )}
                      {result.companyType !== 'small' && (
                         <div className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-white/10 backdrop-blur-md text-white/90 text-sm font-bold border border-white/20">
                           Standard Taxable Company
                         </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Top Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-muted/30 border-transparent text-center p-4">
                      <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Effective Rate</div>
                      <div className="text-xl font-bold text-[#1E3A5F]">{result.effectiveTaxRate.toFixed(1)}%</div>
                    </Card>
                    <Card className="bg-muted/30 border-transparent text-center p-4">
                      <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">CIT Rate</div>
                      <div className="text-xl font-bold text-[#1E3A5F]">{result.citRate}%</div>
                    </Card>
                    <Card className="bg-muted/30 border-transparent text-center p-4">
                      <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Dev. Levy</div>
                      <div className="text-xl font-bold text-[#1E3A5F]">4%</div>
                    </Card>
                  </div>

                  {/* Detailed Breakdowns */}
                  <div className="space-y-3">
                    <DetailedBreakdown
                      title="Profitability Analysis"
                      description="Calculation of taxable profits from assessment base"
                      icon={<TrendingUp className="w-4 h-4" />}
                      defaultOpen={true}
                    >
                      <BreakdownSection>
                        <BreakdownRow label="Total Turnover" value={result.turnover} />
                        <BreakdownRow label="Assessable Profits" value={result.assessableProfits} indent={1} variant="muted" />
                        <BreakdownRow label="Capital Allowances" value={result.capitalAllowances ?? 0} indent={1} variant="muted" />
                        <BreakdownRow label="R&D Deductions" value={result.rdDeductions ?? 0} indent={1} variant="muted" />
                        <BreakdownRow label="Taxable Profits" value={result.taxableProfits} isTotal />
                      </BreakdownSection>
                    </DetailedBreakdown>

                    <DetailedBreakdown
                      title="Tax Component Breakdown"
                      description="Split between CIT, Levy, and Top-Up requirements"
                      icon={<Calculator className="w-4 h-4" />}
                    >
                      <BreakdownSection>
                        <BreakdownRow 
                          label={`CIT (${result.citRate}%)`} 
                          value={result.citAmount} 
                          variant={result.citAmount > 0 ? 'negative' : 'positive'}
                        />
                        <BreakdownRow 
                          label="Development Levy (4%)" 
                          value={result.developmentLevy} 
                          variant={result.developmentLevy > 0 ? 'negative' : 'positive'}
                          citation={{ section: "Section 59", title: "Development Levy", description: "4% of assessable profits for non-small companies." }}
                        />
                        {result.minimumTaxTopUp > 0 && (
                          <BreakdownRow 
                            label="Minimum Tax Top-Up" 
                            value={result.minimumTaxTopUp} 
                            variant="negative"
                            subtext="Required to reach 15% ETR"
                            citation={{ section: "Section 57", title: "Min ETR", description: "Ensures effective tax rate is at least 15%." }}
                          />
                        )}
                        <SummaryRow 
                          label="Total Tax Burden" 
                          value={result.totalTaxBurden}
                          variant={result.totalTaxBurden === 0 ? 'success' : 'default'}
                          className="mt-3"
                        />
                      </BreakdownSection>
                    </DetailedBreakdown>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-2">
                    <PDFDownloadButton 
                        content={generatePDFContent()}
                        className="flex-1 h-12 text-base font-semibold border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F]/5"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="mt-12 bg-blue-50/50 border-blue-100 overflow-hidden">
             <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[#1E3A5F] font-bold mb-1">Tax Classification Guide</h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      The 2026 Tax Act categorizes companies based on turnover to support SMEs. 
                      Ensure your classification is correct as it affects your CIT rate and Development Levy liability.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-3 bg-white rounded-lg border border-blue-200">
                         <div className="text-xs font-bold text-[#1E3A5F] uppercase mb-1">Small</div>
                         <div className="text-sm">Turnover &lt; ₦50M</div>
                         <div className="text-xs text-emerald-600 font-bold">0% CIT / 0% Levy</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-blue-200">
                         <div className="text-xs font-bold text-[#1E3A5F] uppercase mb-1">Medium</div>
                         <div className="text-sm">₦50M - ₦2B</div>
                         <div className="text-xs text-blue-600 font-bold">20% CIT / 4% Levy</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-blue-200">
                         <div className="text-xs font-bold text-[#1E3A5F] uppercase mb-1">Large</div>
                         <div className="text-sm">Turnover &gt; ₦2B</div>
                         <div className="text-xs text-[#1E3A5F] font-bold">30% CIT / 4% Levy</div>
                      </div>
                    </div>
                  </div>
                </div>
             </CardContent>
        </Card>
      </div>
    </div>
  );
}
