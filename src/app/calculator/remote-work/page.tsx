'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DetailedBreakdown, BreakdownSection } from '@/components/calculator/detailed-breakdown';
import { BreakdownRow, TaxBandHeader, TaxBandRow } from '@/components/calculator/breakdown-row';
import { PDFDownloadButton } from '@/components/calculator/pdf-download-button';
import { PDFContent } from '@/lib/pdf-generator';
import { calculatePIT, formatCurrency, PITResult } from '@/lib/tax-engine';
import { Briefcase, Calculator, Globe, Info, Landmark, Layers, Palette, RefreshCcw, Rocket, ShieldCheck, Sparkles, Zap } from 'lucide-react';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
];

export default function RemoteWorkCalculatorPage() {
  const [currency, setCurrency] = useState('USD');
  const [foreignSalary, setForeignSalary] = useState(60000);
  const [exchangeRate, setExchangeRate] = useState(1550);
  const [isStartup, setIsStartup] = useState(false);
  const [isTechDriven, setIsTechDriven] = useState(false);
  const [isCreativeArts, setIsCreativeArts] = useState(false);
  const [isTaxedAbroad, setIsTaxedAbroad] = useState(false);

  const nairaIncome = foreignSalary * exchangeRate;
  const isExempt = (isStartup || isTechDriven || isCreativeArts) && isTaxedAbroad;
  
  const result = useMemo<PITResult | null>(() => {
    if (isExempt) return null;
    return calculatePIT({ grossIncome: nairaIncome });
  }, [isExempt, nairaIncome]);

  const selectedCurrency = currencies.find(c => c.code === currency);

  const resetCalculator = () => {
    setCurrency('USD');
    setForeignSalary(60000);
    setExchangeRate(1550);
    setIsStartup(false);
    setIsTechDriven(false);
    setIsCreativeArts(false);
    setIsTaxedAbroad(false);
  };

  // PDF content generator
  const generatePDFContent = (): PDFContent => {
    return {
      calculatorType: 'Remote Worker & Japa Tax',
      generatedDate: new Date().toLocaleDateString('en-NG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      inputSummary: {
        title: 'Foreign Income Analysis',
        rows: [
          { label: 'Annual Foreign Salary', value: `${selectedCurrency?.symbol}${foreignSalary.toLocaleString()}` },
          { label: 'Exchange Rate', value: `₦${exchangeRate.toLocaleString()} / ${currency}` },
          { label: 'Converted Naira Income', value: nairaIncome, isCurrency: true },
          { label: 'Exemption Qualified', value: isExempt ? 'Yes (Section 13(2))' : 'No' },
        ],
      },
      breakdown: [
        {
          title: 'Exemption Eligibility',
          rows: [
             { label: 'Employer Type', value: isStartup ? 'Startup' : isTechDriven ? 'Tech-Driven' : isCreativeArts ? 'Creative Arts' : 'Standard' },
             { label: 'Taxed in Country of Residence', value: isTaxedAbroad ? 'Yes' : 'No' },
             { label: 'Tax Treatment', value: isExempt ? 'Exempt under S.13(2)' : 'Standard PIT PIT Integration' },
          ],
        },
        ...(result ? [{
          title: 'Nigerian Tax Breakdown',
          rows: [
             { label: 'Taxable Income', value: result.taxableIncome, isCurrency: true },
             { label: 'Total Annual Tax', value: result.totalTax, isCurrency: true, isTotal: true },
             { label: 'Effective Rate', value: `${result.effectiveRate.toFixed(2)}%` },
             { label: 'Net Annual Income (₦)', value: result.netIncome, isCurrency: true, isTotal: true },
          ],
        }] : []),
      ],
      summary: {
        totalTax: result?.totalTax || 0,
        effectiveRate: result?.effectiveRate || 0,
      },
      legalReferences: [
        'Section 13 - Nexus for taxation of employment income',
        'Section 13(2) - Exemption for tech, startups, and creative arts',
        'Section 17 - Significance Economic Presence (SEP)',
        'Residency Rules: 183-day rule for tax residency in Nigeria'
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
              <Globe className="w-3.5 h-3.5" />
              Global Mobility
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Remote & <span className="text-primary">Japa</span> Tax
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Analyze your tax status for foreign employment under the <span className="text-blue-600 font-bold">2026 Tax Act</span> cross-border regime.
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
                    <Globe className="w-6 h-6" />
                  </div>
                  Foreign Income
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((c) => (
                            <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Annual Salary</Label>
                      <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">{selectedCurrency?.symbol}</span>
                         <Input 
                           type="number" 
                           value={foreignSalary} 
                           onChange={(e) => setForeignSalary(Number(e.target.value))} 
                           className="pl-8 font-mono h-11"
                         />
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-bold text-muted-foreground uppercase">Exchange Rate (₦/{currency})</Label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">₦</span>
                      <Input 
                        type="number" 
                        value={exchangeRate} 
                        onChange={(e) => setExchangeRate(Number(e.target.value))} 
                        className="pl-8 font-mono h-11" 
                      />
                   </div>
                </div>

                <div className="p-4 bg-[#1E3A5F]/5 rounded-xl border border-[#1E3A5F]/10 flex justify-between items-center">
                   <div>
                      <div className="text-[10px] text-[#1E3A5F] font-bold uppercase tracking-widest opacity-70">Naira Equivalent</div>
                      <div className="text-xl font-bold text-[#1E3A5F] font-mono">{formatCurrency(nairaIncome)}</div>
                   </div>
                   <Zap className="w-6 h-6 text-[#1E3A5F] opacity-20" />
                </div>

                <div className="pt-4 border-t border-dashed space-y-4">
                   <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SEC. 13(2) Exemption Qualification</h4>
                   
                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                        <div className="flex items-center gap-3">
                           <Rocket className="w-4 h-4 text-[#1E3A5F]" />
                           <span className="text-xs font-medium">Labeled Startup?</span>
                        </div>
                        <Switch checked={isStartup} onCheckedChange={setIsStartup} />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                        <div className="flex items-center gap-3">
                           <Layers className="w-4 h-4 text-[#1E3A5F]" />
                           <span className="text-xs font-medium">Tech-Driven Services?</span>
                        </div>
                        <Switch checked={isTechDriven} onCheckedChange={setIsTechDriven} />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                        <div className="flex items-center gap-3">
                           <Palette className="w-4 h-4 text-[#1E3A5F]" />
                           <span className="text-xs font-medium">Creative Arts Industry?</span>
                        </div>
                        <Switch checked={isCreativeArts} onCheckedChange={setIsCreativeArts} />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-100 rounded-lg">
                        <div className="flex items-center gap-3">
                           <Landmark className="w-4 h-4 text-rose-600" />
                           <span className="text-xs font-medium text-rose-900">Taxed Abroad?</span>
                        </div>
                        <Switch checked={isTaxedAbroad} onCheckedChange={setIsTaxedAbroad} />
                      </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full text-muted-foreground" onClick={resetCalculator}>
               <RefreshCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
             <AnimatePresence mode="wait">
                {isExempt ? (
                  <motion.div
                    key="exempt"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <Card className="relative overflow-hidden border-0 shadow-2xl premium-gradient-emerald text-white">
                       <div className="absolute inset-0 vibrant-shimmer opacity-20" />
                       <div className="absolute top-0 right-0 p-10 opacity-5">
                          <Sparkles className="w-48 h-48" />
                       </div>
                       <CardContent className="p-10 text-center relative z-10">
                          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-white/30">
                             <ShieldCheck className="w-12 h-12 text-white" />
                          </div>
                          <h2 className="text-4xl font-black mb-4 tracking-tight">EXEMPT FROM PIT</h2>
                          <p className="text-emerald-50 max-w-md mx-auto text-lg font-medium leading-relaxed mb-8">
                             Under Section 13(2), your foreign employment income is 100% tax-exempt in Nigeria.
                          </p>
                          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-2xl text-xs font-bold border border-white/20">
                             <Info className="w-4 h-4 text-emerald-300" />
                             <span>Status: Qualified via Country of Residence Taxation</span>
                          </div>
                       </CardContent>
                    </Card>

                    <DetailedBreakdown
                      title="Legal Ground for Exemption"
                      description="Why you qualify under the 2026 Tax Act"
                      icon={<Briefcase className="w-4 h-4" />}
                      defaultOpen={true}
                    >
                      <BreakdownSection>
                         <BreakdownRow label="Sector Eligibility" value={isStartup ? 'Startup Label' : isTechDriven ? 'Tech Services' : 'Creative Arts'} isText variant="positive" />
                         <BreakdownRow label="Residence Taxation" value="Verified (Taxed Abroad)" isText variant="positive" />
                         <BreakdownRow label="Nexus Check" value="Exempt Status Granted" isText variant="highlight" citation={{ section: "Section 13(2)", title: "Remote Work Relief", description: "Incentivizes global remote work for Nigerians by avoiding double taxation for specific sectors." }} />
                      </BreakdownSection>
                    </DetailedBreakdown>
                    
                    <PDFDownloadButton 
                      content={generatePDFContent()}
                      className="w-full h-12 border-[#1E3A5F] text-[#1E3A5F]"
                    />
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="taxable"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Taxable Total Card */}
                    <Card className="relative overflow-hidden border-0 shadow-2xl premium-gradient text-white">
                       <div className="absolute inset-0 vibrant-shimmer opacity-20" />
                       <CardContent className="p-10 relative z-10">
                          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
                             <div className="text-center md:text-left">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 block mb-3">Annual Tax Liability</span>
                                <h2 className="text-5xl font-black font-mono tracking-tighter text-rose-300">{formatCurrency(result.totalTax)}</h2>
                             </div>
                             <div className="text-center md:text-right">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 block mb-3">Effective Rate</span>
                                <h2 className="text-4xl font-black font-mono tracking-tighter">{result.effectiveRate.toFixed(1)}%</h2>
                             </div>
                          </div>
                          <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                             <span className="text-sm font-bold opacity-70">Annual Net (₦)</span>
                             <span className="text-3xl font-black text-emerald-300 font-mono tracking-tighter">{formatCurrency(result.netIncome)}</span>
                          </div>
                       </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                       <Card className="bg-muted/30 border-transparent p-4 text-center">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Monthly Tax</div>
                          <div className="text-xl font-bold text-rose-500">{formatCurrency(result.monthlyTax)}</div>
                       </Card>
                       <Card className="bg-muted/30 border-transparent p-4 text-center">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Monthly Net</div>
                          <div className="text-xl font-bold text-emerald-600">{formatCurrency(result.monthlyNetIncome)}</div>
                       </Card>
                    </div>

                    {/* Breakdowns */}
                    <div className="space-y-3">
                      <DetailedBreakdown
                        title="Nigerian Tax Calculation"
                        description="PIT application to converted foreign income"
                        icon={<Calculator className="w-4 h-4" />}
                        defaultOpen={true}
                      >
                         <BreakdownSection>
                            <BreakdownRow label="Annual Gross Income" value={nairaIncome} />
                            <BreakdownRow label="Taxable Income" value={result.taxableIncome} indent={1} variant="muted" />
                            <BreakdownRow label="Total Calculated PIT" value={result.totalTax} isTotal />
                         </BreakdownSection>

                         <BreakdownSection title="Progressive Band Application" className="mt-4">
                            <TaxBandHeader />
                            {result.taxByBand.map((band, i) => (
                               <TaxBandRow 
                                 key={i}
                                 band={band.band}
                                 rate={`${band.rate}%`}
                                 taxableAmount={band.amount}
                                 tax={band.tax}
                               />
                            ))}
                         </BreakdownSection>
                      </DetailedBreakdown>
                    </div>

                    <PDFDownloadButton 
                      content={generatePDFContent()}
                      className="w-full h-12 border-[#1E3A5F] text-[#1E3A5F]"
                    />
                  </motion.div>
                ) : null}
             </AnimatePresence>
          </div>
        </div>

        {/* SEP Info Banner */}
        <Card className="mt-12 bg-amber-50/50 border-amber-100 p-8">
           <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                 <Globe className="w-8 h-8" />
              </div>
              <div>
                 <h4 className="text-amber-900 font-bold mb-2">Significant Economic Presence (SEP) Rules</h4>
                 <p className="text-sm text-amber-800 leading-relaxed mb-4">
                    The 2026 Tax Act enforces SEP rules (Section 17) for non-residents. If you act as a consultant or provide 
                    digital services (Teaching, Gaming, Streaming, Advertising) to Nigerian residents while living abroad, 
                    the foreign company may have tax obligations in Nigeria.
                 </p>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['E-Commerce', 'Online Gaming', 'Cloud Storage', 'Streaming'].map((item) => (
                       <div key={item} className="text-[10px] font-bold text-amber-700 bg-white border border-amber-200 px-3 py-1.5 rounded-lg text-center uppercase tracking-wider">
                          {item}
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
