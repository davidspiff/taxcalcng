'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CurrencyInput } from '@/components/ui/currency-input';
import { ComparisonChart } from '@/components/charts/comparison-chart';
import { DetailedBreakdown, BreakdownSection } from '@/components/calculator/detailed-breakdown';
import { BreakdownRow, SummaryRow, TaxBandRow, TaxBandHeader } from '@/components/calculator/breakdown-row';
import { PDFDownloadButton } from '@/components/calculator/pdf-download-button';
import { PDFContent } from '@/lib/pdf-generator';
import { comparePIT, calculatePIT2025, formatCurrency, PITInput, PITComparisonResult, PITResult } from '@/lib/tax-engine';
import { ChevronDown, ChevronUp, Info, RefreshCcw, TrendingDown, TrendingUp, Zap, ShieldCheck, Calculator, FileText, Scale, Layers } from 'lucide-react';
import { CitationTooltip } from '@/components/citation-tooltip';
import TAX_RULES from '@/lib/tax-engine/tax-rules.json';

const INITIAL_PIT_INPUTS: PITInput = {
  grossIncome: 5000000,
  housingAllowance: 0,
  transportAllowance: 0,
  otherAllowances: 0,
  pensionContribution: 0,
  nhfContribution: 0,
  nhisContribution: 0,
  lifeInsurance: 0,
  annualRentPaid: 0,
  isMinimumWage: false,
  assistiveDevices: 0,
};

const MINIMUM_WAGE_ANNUAL = TAX_RULES.tax_regime_2026.pit.minimum_wage_amount * 12;

export default function PITCalculatorPage() {
  const [profile, setProfile] = useState<PITInput>(INITIAL_PIT_INPUTS);
  const [isAnnual, setIsAnnual] = useState(true);
  const [autoCalculateStatutory, setAutoCalculateStatutory] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('income');

  const updateProfile = (updates: Partial<PITInput>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const resetProfile = () => {
    setProfile(INITIAL_PIT_INPUTS);
    setIsAnnual(true);
    setAutoCalculateStatutory(true);
  };

  // Derived values
  const isMinimumWageComputed = profile.grossIncome <= MINIMUM_WAGE_ANNUAL;
  const baseEmoluments = profile.grossIncome + (profile.housingAllowance || 0) + (profile.transportAllowance || 0);
  const autoPension = Math.round(baseEmoluments * 0.08);
  const autoNhf = Math.round(baseEmoluments * 0.025);
  const autoNhis = Math.round(baseEmoluments * 0.05);

  // Calculate profile with auto values
  const calcProfile: PITInput = useMemo(() => ({
    ...profile,
    isMinimumWage: isMinimumWageComputed,
    pensionContribution: autoCalculateStatutory ? autoPension : (profile.pensionContribution || 0),
    nhfContribution: autoCalculateStatutory ? autoNhf : (profile.nhfContribution || 0),
    nhisContribution: autoCalculateStatutory ? autoNhis : (profile.nhisContribution || 0),
  }), [profile, autoCalculateStatutory, autoPension, autoNhf, autoNhis, isMinimumWageComputed]);

  // Primary result (2026 law)
  const result = useMemo<PITResult | null>(() => {
    return calculatePIT2025(calcProfile);
  }, [calcProfile]);

  // Comparison result (when enabled)
  const comparisonResult = useMemo<PITComparisonResult | null>(() => {
    if (!showComparison) return null;
    return comparePIT(calcProfile);
  }, [calcProfile, showComparison]);

  const handleIncomeChange = (value: number) => {
    const annualValue = isAnnual ? value : value * 12;
    updateProfile({ grossIncome: annualValue });
  };

  const displayIncome = isAnnual ? profile.grossIncome : Math.round(profile.grossIncome / 12);

  // Comparison chart data
  const comparisonData = comparisonResult ? [
    { name: 'Total Tax', old: comparisonResult.old.totalTax, new: comparisonResult.new.totalTax },
    { name: 'Net Income', old: comparisonResult.old.netIncome, new: comparisonResult.new.netIncome },
  ] : [];

  // PDF content generator
  const generatePDFContent = (): PDFContent => {
    const pensionVal = autoCalculateStatutory ? autoPension : (profile.pensionContribution || 0);
    const nhfVal = autoCalculateStatutory ? autoNhf : (profile.nhfContribution || 0);
    const nhisVal = autoCalculateStatutory ? autoNhis : (profile.nhisContribution || 0);
    
    return {
      calculatorType: 'Personal Income Tax (PIT)',
      generatedDate: new Date().toLocaleDateString('en-NG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      inputSummary: {
        title: 'Input Summary',
        rows: [
          { label: 'Gross Salary', value: profile.grossIncome, isCurrency: true },
          { label: 'Housing Allowance', value: profile.housingAllowance || 0, isCurrency: true },
          { label: 'Transport Allowance', value: profile.transportAllowance || 0, isCurrency: true },
          { label: 'Total Emoluments', value: baseEmoluments, isCurrency: true, isTotal: true },
        ],
      },
      breakdown: [
        {
          title: 'Statutory Deductions',
          rows: [
            { label: 'Pension (8%)', value: pensionVal, isCurrency: true },
            { label: 'NHF (2.5%)', value: nhfVal, isCurrency: true },
            { label: 'NHIS (5%)', value: nhisVal, isCurrency: true },
            { label: 'Life Insurance', value: profile.lifeInsurance || 0, isCurrency: true },
            { label: 'Total Deductions', value: pensionVal + nhfVal + nhisVal + (profile.lifeInsurance || 0), isCurrency: true, isTotal: true },
          ],
        },
        {
          title: 'Tax Reliefs',
          rows: [
            { label: 'Consolidated Relief (CRA)', value: result?.taxableIncome ? profile.grossIncome - result.taxableIncome : 0, isCurrency: true },
            { label: 'Rent Relief (20% capped)', value: Math.min((profile.annualRentPaid || 0) * 0.2, 500000), isCurrency: true },
            { label: 'Disability Relief', value: profile.assistiveDevices || 0, isCurrency: true },
          ],
        },
        {
          title: 'Taxable Income Calculation',
          rows: [
            { label: 'Gross Income', value: profile.grossIncome, isCurrency: true },
            { label: 'Less: Deductions & Reliefs', value: profile.grossIncome - (result?.taxableIncome || 0), isCurrency: true, isDeduction: true },
            { label: 'Taxable Income', value: result?.taxableIncome || 0, isCurrency: true, isTotal: true },
          ],
        },
      ],
      taxBands: result?.taxByBand.map(band => ({
        band: band.band,
        rate: `${band.rate}%`,
        amount: band.amount || 0,
        tax: band.tax,
      })) || [],
      summary: {
        totalTax: result?.totalTax || 0,
        effectiveRate: result?.effectiveRate,
        netIncome: result?.netIncome,
      },
      comparison: showComparison && comparisonResult ? {
        oldTax: comparisonResult.old.totalTax,
        newTax: comparisonResult.new.totalTax,
        savings: comparisonResult.savings,
        savingsPercent: comparisonResult.savingsPercentage,
      } : undefined,
      legalReferences: [
        'Section 30 - Allowable Deductions',
        'Fourth Schedule - Tax Rate Bands',
        'Section 30(2)(a)(vi) - Rent Relief (20% capped at ₦500k)',
        'Section 20(1)(m) - Disability/Assistive Device Relief',
      ],
    };
  };

  return (
    <div className="min-h-screen pb-20 bg-background print:bg-white print:min-h-0 print:pb-0">
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
              <Calculator className="w-3.5 h-3.5" />
              Tax Calculator
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Personal Income <span className="text-primary">Tax</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Calculate your precise tax liability under the <span className="text-emerald-600 font-bold">2026 Tax Act</span> with our intelligent engine.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center mb-8 pt-8">
        <h1 className="text-3xl font-bold text-[#1E3A5F]">TaxCalc Nigeria Report</h1>
        <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8 relative">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6 print:col-span-12">
            
            {/* Income Section */}
            <Card className="glass-card border-border/40 shadow-xl overflow-hidden py-0">
              <CardHeader className="bg-primary/5 dark:bg-primary/10 pb-5 pt-8 px-8 border-b border-border/40">
                <CardTitle className="flex items-center justify-between text-2xl font-bold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary text-white rounded-xl shadow-lg ring-4 ring-primary/10">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    Income Details
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-1.5 rounded-xl border border-border/40 shadow-sm print:hidden">
                    <span className={!isAnnual ? 'text-primary' : 'text-muted-foreground'}>Monthly</span>
                    <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-primary" />
                    <span className={isAnnual ? 'text-primary' : 'text-muted-foreground'}>Annual</span>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="py-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="grossIncome" className="text-base font-medium text-foreground/80">
                        Gross Salary ({isAnnual ? 'Annual' : 'Monthly'})
                      </Label>
                      {isMinimumWageComputed && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                           <ShieldCheck className='w-3 h-3'/> Min. Wage Exempt
                           <CitationTooltip 
                             section="Fourth Schedule" 
                             title="Minimum Wage Exemption" 
                             description="Individuals earning the national minimum wage are exempt from PIT under the 2026 Act."
                           />
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-[#1E3A5F] font-mono font-bold">
                      {formatCurrency(displayIncome)}
                    </span>
                  </div>
                  
                  <div className="flex gap-4 items-center print:hidden">
                    <CurrencyInput
                      id="grossIncome"
                      value={displayIncome}
                      onChange={handleIncomeChange}
                      className="flex-1 h-12 text-lg shadow-sm border-[#1E3A5F]/20 focus:border-[#1E3A5F]"
                    />
                  </div>
                  
                  <Slider
                    value={[Math.min(displayIncome, 50000000)]}
                    max={50000000}
                    step={100000}
                    onValueChange={([val]) => handleIncomeChange(val)}
                    className="py-2 print:hidden"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground px-1 print:hidden">
                    <span>₦0</span>
                    <span>₦50M+</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed">
                   <button 
                    onClick={() => setActiveSection(activeSection === 'allowances' ? null : 'allowances')}
                    className="flex items-center justify-between w-full text-left group print:hidden"
                   >
                     <span className="font-medium text-foreground/70 group-hover:text-[#1E3A5F] transition-colors">Allowances Breakdown</span>
                     {activeSection === 'allowances' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                   </button>
                   
                   <AnimatePresence>
                    {activeSection === 'allowances' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Housing</Label>
                            <CurrencyInput
                              value={profile.housingAllowance || 0}
                              onChange={(v) => updateProfile({ housingAllowance: v })}
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Transport</Label>
                            <CurrencyInput
                              value={profile.transportAllowance || 0}
                              onChange={(v) => updateProfile({ transportAllowance: v })}
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                   </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Deductions Section */}
            <Card className="glass-card border-border/40 shadow-xl overflow-hidden py-0">
              <CardHeader className="bg-primary/5 dark:bg-primary/10 pb-5 pt-8 px-8 border-b border-border/40">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                  <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg ring-4 ring-emerald-500/10">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  Tax Deductions
                  <div className="flex items-center gap-2 ml-auto text-xs font-bold bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-500/20 print:hidden transition-all hover:bg-emerald-500/20">
                    <Zap className="w-3.5 h-3.5 fill-emerald-500" />
                    <span className="hidden sm:inline">Smart Mode</span>
                    <Switch 
                      checked={autoCalculateStatutory} 
                      onCheckedChange={setAutoCalculateStatutory}
                      className="h-5 w-9 data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                {autoCalculateStatutory && (
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs text-emerald-800 flex items-start gap-3 mb-2 animate-in fade-in slide-in-from-top-1">
                    <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p>
                      <strong>Smart Mode Active:</strong> Pension, NHF, and NHIS are being automatically calculated based on your total emoluments.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        Pension (8%)
                        <CitationTooltip 
                          section="Section 30(2)(a)(iii)" 
                          title="Pension Contribution" 
                          description="Mandatory 8% contribution of Basic + Housing + Transport allows for tax relief."
                        />
                      </div>
                      {autoCalculateStatutory && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded font-normal">Auto</span>
                      )}
                    </Label>
                    <CurrencyInput
                      value={autoCalculateStatutory ? autoPension : (profile.pensionContribution || 0)}
                      onChange={(v) => updateProfile({ pensionContribution: v })}
                      disabled={autoCalculateStatutory}
                      className={autoCalculateStatutory ? 'bg-muted/50 cursor-not-allowed border-dashed' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        NHF (2.5%)
                        <CitationTooltip 
                          section="NHF Act" 
                          title="National Housing Fund" 
                          description="Contribution of 2.5% of monthly basic salary (+ Housing + Transport)."
                        />
                      </div>
                      {autoCalculateStatutory && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded font-normal">Auto</span>
                      )}
                    </Label>
                    <CurrencyInput
                      value={autoCalculateStatutory ? autoNhf : (profile.nhfContribution || 0)}
                      onChange={(v) => updateProfile({ nhfContribution: v })}
                      disabled={autoCalculateStatutory}
                      className={autoCalculateStatutory ? 'bg-muted/50 cursor-not-allowed border-dashed' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        NHIS (5%)
                        <CitationTooltip 
                          section="NHIS Act" 
                          title="Health Insurance" 
                          description="Contributions to the National Health Insurance Scheme are tax deductible."
                        />
                      </div>
                      {autoCalculateStatutory && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded font-normal">Auto</span>
                      )}
                    </Label>
                    <CurrencyInput
                      value={autoCalculateStatutory ? autoNhis : (profile.nhisContribution || 0)}
                      onChange={(v) => updateProfile({ nhisContribution: v })}
                      disabled={autoCalculateStatutory}
                      className={autoCalculateStatutory ? 'bg-muted/50 cursor-not-allowed border-dashed' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80 flex items-center gap-1">
                      Life Insurance
                      <CitationTooltip 
                        section="Section 33 (PIT Act)" 
                        title="Life Assurance Premium" 
                        description="Premiums paid on life insurance policies for self or spouse are deductible."
                      />
                    </Label>
                    <CurrencyInput
                      value={profile.lifeInsurance || 0}
                      onChange={(v) => updateProfile({ lifeInsurance: v })}
                    />
                  </div>
                </div>

                {/* Additional Reliefs */}
                <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium mb-2">
                    <Info className="w-4 h-4" />
                    <span>Additional Reliefs (2026 Act)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        Annual Rent Paid
                        <CitationTooltip 
                          section="Section 30(2)(a)(vi)" 
                          title="Rent Relief" 
                          description="Deduction of 20% of annual rent paid, capped at N500,000."
                        />
                      </Label>
                      <CurrencyInput
                        value={profile.annualRentPaid || 0}
                        onChange={(v) => updateProfile({ annualRentPaid: v })}
                        className="bg-white dark:bg-background"
                      />
                      <p className="text-[10px] text-emerald-600">
                        Tax deductible up to ₦500k
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        Disability Relief
                        <CitationTooltip 
                          section="Section 20(1)(m)" 
                          title="Assistive Devices" 
                          description="Full deduction for expenses on assistive devices and disability-related products."
                        />
                      </Label>
                      <CurrencyInput
                        value={profile.assistiveDevices || 0}
                        onChange={(v) => updateProfile({ assistiveDevices: v })}
                        className="bg-white dark:bg-background"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 print:col-span-12">
            <div className="sticky top-24 space-y-6 print:static">
              
              {/* Primary Result Card */}
              {result && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={result.totalTax}
                >
                  <Card className="relative border-0 shadow-2xl overflow-hidden premium-gradient text-white">
                    <div className="absolute inset-0 vibrant-shimmer opacity-20" />
                    <CardContent className="p-8 relative">
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div className="space-y-1">
                          <div className="text-white/60 text-xs font-bold uppercase tracking-[0.15em]">Total Tax</div>
                          <div className="text-2xl md:text-4xl font-black font-mono tracking-tighter">
                            {formatCurrency(result.totalTax)}
                          </div>
                        </div>
                        <div className="space-y-1 border-x border-white/10 px-4">
                          <div className="text-white/60 text-xs font-bold uppercase tracking-[0.15em]">Effective</div>
                          <div className="text-2xl md:text-4xl font-black tracking-tighter">
                            {result.effectiveRate.toFixed(1)}%
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-emerald-300/80 text-xs font-bold uppercase tracking-[0.15em]">Savings</div>
                          <div className="text-2xl md:text-4xl font-black font-mono text-emerald-300 tracking-tighter">
                            {formatCurrency(result.netIncome)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Detailed Breakdown Section */}
              <div className="space-y-3">
                <DetailedBreakdown
                  title="Income & Deductions"
                  description="Your gross income and statutory deductions"
                  icon={<Calculator className="w-4 h-4" />}
                  defaultOpen={true}
                >
                  <BreakdownSection>
                    <BreakdownRow label="Gross Salary" value={profile.grossIncome} />
                    <BreakdownRow label="Housing Allowance" value={profile.housingAllowance || 0} indent={1} variant="muted" />
                    <BreakdownRow label="Transport Allowance" value={profile.transportAllowance || 0} indent={1} variant="muted" />
                    <BreakdownRow label="Total Emoluments" value={baseEmoluments} isTotal />
                  </BreakdownSection>
                  
                  <BreakdownSection title="Statutory Deductions" className="mt-4">
                    <BreakdownRow 
                      label="Pension" 
                      value={autoCalculateStatutory ? autoPension : (profile.pensionContribution || 0)} 
                      isDeduction
                      percentage={8}
                      citation={{ section: "Section 30(2)(a)(iii)", title: "Pension", description: "8% of emoluments" }}
                    />
                    <BreakdownRow 
                      label="NHF" 
                      value={autoCalculateStatutory ? autoNhf : (profile.nhfContribution || 0)} 
                      isDeduction
                      percentage={2.5}
                    />
                    <BreakdownRow 
                      label="NHIS" 
                      value={autoCalculateStatutory ? autoNhis : (profile.nhisContribution || 0)} 
                      isDeduction
                      percentage={5}
                    />
                    {(profile.lifeInsurance || 0) > 0 && (
                      <BreakdownRow label="Life Insurance" value={profile.lifeInsurance || 0} isDeduction />
                    )}
                  </BreakdownSection>
                </DetailedBreakdown>

                <DetailedBreakdown
                  title="Tax Bands Breakdown"
                  description="How your income is taxed progressively"
                  icon={<Layers className="w-4 h-4" />}
                  badge="2026"
                  badgeVariant="success"
                >
                  <div className="bg-muted/30 rounded-lg p-3">
                    <TaxBandHeader />
                    {result?.taxByBand.map((band, i) => (
                      <TaxBandRow 
                        key={i}
                        band={band.band}
                        rate={band.rate}
                        taxableAmount={band.amount || 0}
                        tax={band.tax}
                        isExempt={band.rate === 0}
                      />
                    ))}
                    {(!result?.taxByBand.length) && (
                      <p className="text-sm text-emerald-600 py-4 text-center italic">
                        Completely Tax Free! 🎉
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <BreakdownRow label="Taxable Income" value={result?.taxableIncome || 0} />
                    <SummaryRow 
                      label="Total Tax" 
                      value={result?.totalTax || 0}
                      variant={result?.totalTax === 0 ? 'success' : 'default'}
                      className="mt-2"
                    />
                  </div>
                </DetailedBreakdown>

                <DetailedBreakdown
                  title="Net Income Summary"
                  description="Your take-home after all deductions and taxes"
                  icon={<FileText className="w-4 h-4" />}
                >
                  <BreakdownRow label="Gross Income" value={profile.grossIncome} />
                  <BreakdownRow label="Total Deductions" value={((autoCalculateStatutory ? autoPension + autoNhf + autoNhis : (profile.pensionContribution || 0) + (profile.nhfContribution || 0) + (profile.nhisContribution || 0)) + (profile.lifeInsurance || 0))} isDeduction />
                  <BreakdownRow label="Total Tax" value={result?.totalTax || 0} isDeduction />
                  <SummaryRow 
                    label="Annual Net Income" 
                    value={result?.netIncome || 0}
                    variant="success"
                    subLabel={`₦${formatCurrency(Math.round((result?.netIncome || 0) / 12)).replace('₦', '')} per month`}
                    className="mt-3"
                  />
                </DetailedBreakdown>
              </div>

              {/* Compare Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/60 print:hidden">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">Compare with Old Law</div>
                    <div className="text-xs text-muted-foreground">See your savings under the 2026 Act</div>
                  </div>
                </div>
                <Switch 
                  checked={showComparison} 
                  onCheckedChange={setShowComparison}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              {/* Comparison Section (when enabled) */}
              <AnimatePresence>
                {showComparison && comparisonResult && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-4"
                  >
                    {/* Savings Banner */}
                    <Card className={`border-0 shadow-lg overflow-hidden ${
                      comparisonResult.savings >= 0 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
                        : 'bg-gradient-to-br from-rose-500 to-red-600 text-white'
                    }`}>
                      <CardContent className="p-6 text-center">
                        <h3 className="text-emerald-50 font-medium mb-1">
                          {comparisonResult.savings >= 0 ? 'Your Annual Savings' : 'Additional Tax Under 2026'}
                        </h3>
                        <div className="text-4xl font-bold mb-2">
                          {formatCurrency(Math.abs(comparisonResult.savings))}
                        </div>
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-sm">
                          {comparisonResult.savings >= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                          <span>{Math.abs(comparisonResult.savingsPercentage).toFixed(1)}% {comparisonResult.savings >= 0 ? 'reduction' : 'increase'}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Comparison Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-muted/50 border-transparent">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Old Law</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                          <div>
                            <div className="text-xs text-muted-foreground">Total Tax</div>
                            <div className="text-lg font-mono text-rose-500 font-medium">
                              {formatCurrency(comparisonResult.old.totalTax)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Net Income</div>
                            <div className="text-base font-semibold">
                              {formatCurrency(comparisonResult.old.netIncome)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200/50">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm text-emerald-600 uppercase tracking-wider">2026</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                          <div>
                            <div className="text-xs text-emerald-600/70">Total Tax</div>
                            <div className="text-lg font-mono text-emerald-600 font-medium">
                              {formatCurrency(comparisonResult.new.totalTax)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-emerald-600/70">Net Income</div>
                            <div className="text-base font-semibold text-emerald-700">
                              {formatCurrency(comparisonResult.new.netIncome)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Comparison Chart */}
                    <Card className="border shadow-sm">
                      <CardContent className="p-4">
                        <div className="h-64">
                          <ComparisonChart data={comparisonData} height="100%" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-2 print:hidden">
                <PDFDownloadButton 
                  content={generatePDFContent()}
                  label="Download Report"
                  className="flex-1"
                />
                <Button 
                  variant="secondary" 
                  onClick={resetProfile}
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
