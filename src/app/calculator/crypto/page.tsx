'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Switch } from '@/components/ui/switch';
import { DetailedBreakdown, BreakdownSection } from '@/components/calculator/detailed-breakdown';
import { BreakdownRow, SummaryRow } from '@/components/calculator/breakdown-row';
import { PDFDownloadButton } from '@/components/calculator/pdf-download-button';
import { PDFContent } from '@/lib/pdf-generator';
import { calculateCryptoTax, formatCurrency, CryptoTaxInput, CryptoTaxResult } from '@/lib/tax-engine';
import { CitationTooltip } from '@/components/citation-tooltip';
import { AlertCircle, Bitcoin, Calculator, History, Info, Layers, MinusCircle, PlusCircle, RefreshCcw, ShieldCheck, TrendingDown, TrendingUp, Trash2 } from 'lucide-react';

interface Transaction {
  id: number;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
}

const INITIAL_TRANSACTION: Transaction = {
  id: 1,
  buyPrice: 1000000,
  sellPrice: 1500000,
  quantity: 1,
};

export default function CryptoCalculatorPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([INITIAL_TRANSACTION]);
  const [isCompany, setIsCompany] = useState(false);

  const result = useMemo<CryptoTaxResult | null>(() => {
    if (!transactions.length) return null;
    const input: CryptoTaxInput = {
      transactions: transactions.map((t) => ({
        buyPrice: t.buyPrice,
        sellPrice: t.sellPrice,
        quantity: t.quantity,
      })),
    };
    return calculateCryptoTax(input, isCompany);
  }, [transactions, isCompany]);

  const addTransaction = () => {
    setTransactions(prev => [
      ...prev,
      { id: Date.now(), buyPrice: 0, sellPrice: 0, quantity: 1 },
    ]);
  };

  const removeTransaction = (id: number) => {
    if (transactions.length > 1) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const resetCalculator = () => {
    setTransactions([INITIAL_TRANSACTION]);
    setIsCompany(false);
  };

  // PDF content generator
  const generatePDFContent = (): PDFContent => {
    if (!result) return {} as PDFContent;
    
    return {
      calculatorType: 'Crypto & Digital Asset Tax',
      generatedDate: new Date().toLocaleDateString('en-NG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      inputSummary: {
        title: 'Transaction History',
        rows: transactions.map((tx, idx) => ({
          label: `Transaction #${idx + 1} (${tx.quantity} unit${tx.quantity !== 1 ? 's' : ''})`,
          value: (tx.sellPrice - tx.buyPrice) * tx.quantity,
          isCurrency: true,
          isDeduction: (tx.sellPrice - tx.buyPrice) < 0
        })),
      },
      breakdown: [
        {
          title: 'Taxable Aggregation',
          rows: [
            { label: 'Total Gross Gains', value: result.totalGains, isCurrency: true },
            { label: 'Allowable Asset-Specific Losses', value: result.totalLosses, isCurrency: true, isDeduction: true },
            { label: 'Net Chargeable Position', value: result.netPosition, isCurrency: true, isTotal: true },
          ],
        },
      ],
      summary: {
        totalTax: result.cgtDue,
      },
      legalReferences: [
        'Section 34 - Digital Assets (Chargeable assets definition)',
        'Section 27(6) - Loss Restriction (Losses only offset crypto gains)',
        'Section 27(6) - Carry Forward (Net losses carried to future years)',
        'Integration: Individual gains taxed via PIT, Corporate gains via CIT'
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
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Bitcoin className="w-3.5 h-3.5" />
              Digital Assets
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Crypto <span className="text-primary">Tax</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Analyze your digital asset transactions and tax liability under the <span className="text-orange-600 font-bold">2026 Tax Act</span> crypto regime.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 shadow-sm relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <AlertCircle className="w-24 h-24" />
           </div>
           <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center text-rose-600 shadow-sm">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="relative z-10">
                <h4 className="font-bold text-lg text-rose-800 mb-1 flex items-center gap-2">
                  Section 27(6) Loss Restiction
                  <CitationTooltip section="Section 27(6)" title="Loss Ring-fencing" description="Losses on digital assets can only be offset against gains from digital assets." />
                </h4>
                <p className="text-sm text-rose-700 leading-relaxed max-w-3xl">
                  Digital asset losses <strong className="font-bold uppercase">cannot</strong> be offset against other income sources like salary or business profits. 
                  They are ring-fenced and can only reduce your tax on other crypto gains. Unused losses are carried forward.
                </p>
              </div>
           </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="glass-card border-border/40 shadow-xl overflow-hidden py-0 font-sans text-slate-900 dark:text-white">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-primary/5 dark:bg-primary/10 pb-5 pt-8 px-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                  <div className="p-2.5 bg-primary text-white rounded-xl shadow-lg ring-4 ring-primary/10">
                    <History className="w-6 h-6" />
                  </div>
                  Transactions
                </CardTitle>
                <Button onClick={addTransaction} variant="outline" size="sm" className="h-9 px-4 font-bold border-2 border-dashed border-primary/30 hover:border-primary text-primary transition-all active:scale-95">
                   <PlusCircle className="w-4 h-4 mr-1.5" /> <span className="hidden sm:inline">Add Asset</span>
                </Button>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/60">
                  <div>
                    <Label className="text-sm font-medium">Reporting as Company?</Label>
                    <p className="text-[10px] text-muted-foreground">Companies pay CIT rate on chargeable gains</p>
                  </div>
                  <Switch checked={isCompany} onCheckedChange={setIsCompany} className="data-[state=checked]:bg-[#1E3A5F]" />
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {transactions.map((tx, index) => (
                    <div key={tx.id} className="p-4 rounded-xl border border-muted bg-white/50 relative group transition-all hover:bg-white hover:shadow-md">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Asset Disposal #{index + 1}</span>
                         {transactions.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-rose-500"
                              onClick={() => removeTransaction(tx.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                         )}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                         <div className="space-y-1.5">
                            <Label className="text-[10px]">Buy Price</Label>
                            <CurrencyInput value={tx.buyPrice} onChange={(v) => updateTransaction(tx.id, { buyPrice: v })} className="h-9 text-xs" />
                         </div>
                         <div className="space-y-1.5">
                            <Label className="text-[10px]">Sell Price</Label>
                            <CurrencyInput value={tx.sellPrice} onChange={(v) => updateTransaction(tx.id, { sellPrice: v })} className="h-9 text-xs" />
                         </div>
                         <div className="space-y-1.5">
                            <Label className="text-[10px]">Qty</Label>
                            <CurrencyInput value={tx.quantity} onChange={(v) => updateTransaction(tx.id, { quantity: v })} className="h-9 text-xs" isCurrency={false} />
                         </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                         <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                           (tx.sellPrice - tx.buyPrice) >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                         }`}>
                           {(tx.sellPrice - tx.buyPrice) >= 0 ? '↑ GAIN' : '↓ LOSS'}
                         </div>
                         <span className="font-mono text-xs font-semibold">
                            {formatCurrency((tx.sellPrice - tx.buyPrice) * tx.quantity)}
                         </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full text-muted-foreground" onClick={resetCalculator}>
               <RefreshCcw className="w-4 h-4 mr-2" /> Reset All
            </Button>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={result.cgtDue + transactions.length}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Primary Total */}
                  <Card className="relative border-0 shadow-2xl overflow-hidden premium-gradient text-white">
                    <div className="absolute inset-0 vibrant-shimmer opacity-20" />
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <Bitcoin className="w-32 h-32" />
                    </div>
                    <CardContent className="p-10 text-center relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 block mb-4">Total Tax Due</span>
                      <h2 className={`text-5xl md:text-6xl font-black font-mono tracking-tighter ${result.cgtDue === 0 ? 'text-emerald-300' : 'text-white'}`}>
                        {formatCurrency(result.cgtDue)}
                      </h2>
                      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                         <div className="text-center">
                            <div className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1.5">Tax Method</div>
                            <div className="text-xs font-bold bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/10">
                               {isCompany ? 'Company CIT' : 'Individual PIT'}
                            </div>
                         </div>
                         <div className="hidden sm:block w-px h-8 bg-white/20" />
                         <div className="text-center">
                            <div className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1.5">Chargeable Asset</div>
                            <div className="text-xs font-bold bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/10">
                               Digital Assets (S.34)
                            </div>
                         </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Totals */}
                  <div className="grid grid-cols-2 gap-4">
                     <Card className="bg-emerald-50/50 border-emerald-100 p-4">
                        <div className="flex justify-between items-center">
                           <TrendingUp className="w-4 h-4 text-emerald-600" />
                           <span className="font-mono font-bold text-emerald-700">{formatCurrency(result.totalGains)}</span>
                        </div>
                        <div className="text-[10px] uppercase text-emerald-800 font-bold mt-2">Total Gross Gains</div>
                     </Card>
                     <Card className="bg-rose-50/50 border-rose-100 p-4">
                        <div className="flex justify-between items-center">
                           <TrendingDown className="w-4 h-4 text-rose-600" />
                           <span className="font-mono font-bold text-rose-700">{formatCurrency(result.totalLosses)}</span>
                        </div>
                        <div className="text-[10px] uppercase text-rose-800 font-bold mt-2">Total Gross Losses</div>
                     </Card>
                  </div>

                  {/* Detailed Breakdowns */}
                  <div className="space-y-3">
                    <DetailedBreakdown
                      title="Chargeable Base Analysis"
                      description="Aggregation of gains and impact of restrictions"
                      icon={<Calculator className="w-4 h-4" />}
                      defaultOpen={true}
                    >
                      <BreakdownSection>
                         <BreakdownRow label="Gross Positive Gains" value={result.totalGains} variant="positive" />
                         <BreakdownRow 
                           label="Allowable Section 27(6) Losses" 
                           value={result.totalLosses} 
                           isDeduction 
                           variant="negative"
                           citation={{ section: "Section 27(6)", title: "Symmetry Rule", description: "Losses are only deductible against gains from the same asset class (Digital Assets)." }}
                         />
                         <BreakdownRow label="Carry Forward Offset" value={0} isDeduction variant="muted" />
                         <BreakdownRow label="Net Position" value={result.netPosition} isTotal />
                      </BreakdownSection>
                      
                      {result.netPosition < 0 && (
                        <div className="mt-4 p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
                          <div className="flex items-start gap-3">
                             <MinusCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                             <div>
                                <h5 className="text-sm font-bold text-amber-900 mb-1">Loss Carry Forward Activated</h5>
                                <p className="text-xs text-amber-800/80 leading-relaxed">
                                  Your net loss of <strong>{formatCurrency(Math.abs(result.netPosition))}</strong> is not deductible against other income. 
                                  It has been recorded and will be carried forward to offset future digital asset gains.
                                </p>
                             </div>
                          </div>
                        </div>
                      )}
                    </DetailedBreakdown>

                    <DetailedBreakdown
                      title="Tax Treatment Integration"
                      description="How your net gains are taxed in 2026"
                      icon={<Layers className="w-4 h-4" />}
                    >
                      <BreakdownSection>
                        <BreakdownRow label="Chargeable Position" value={Math.max(0, result.netPosition)} />
                        <BreakdownRow label="Income Category" value={isCompany ? 'Corporate Profit' : 'Personal Income'} isText indent={1} variant="muted" />
                        <BreakdownRow 
                          label="Tax Pool Integration" 
                          value={isCompany ? 'SITC @ 30%' : 'PIT Progressivity'} 
                          isText 
                          variant="highlight" 
                        />
                        <SummaryRow label="Estimated Tax Due" value={result.cgtDue} className="mt-4" />
                      </BreakdownSection>
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
          </div>
        </div>

        {/* Legal Context Footer */}
        <Card className="mt-12 bg-blue-50/30 border-blue-100 p-6">
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-blue-900 font-bold mb-1">Modernizing Crypto Taxation</h4>
                <p className="text-sm text-blue-800/80 leading-relaxed">
                  The 2026 Tax Act provides much-needed clarity on digital assets. By explicitly defining them as chargeable assets 
                  under Section 34, while introducing strict ring-fencing of losses under Section 27(6), the law ensures 
                  a balanced and transparent tax regime for the Nigerian digital economy.
                </p>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
