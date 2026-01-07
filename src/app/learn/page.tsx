'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Zap, TrendingUp, Shield, Building2, User, Receipt, Coins, FileText, Globe } from 'lucide-react';
import Link from 'next/link';

const BIG_WINS = [
  {
    title: "Higher Tax-Free Threshold",
    description: "Individuals earning up to ₦800,000 annually now pay 0% PIT, up from the previous much lower limit.",
    icon: User,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Small Business Exemption",
    description: "Companies with annual turnover under ₦50 million are fully exempt from Company Income Tax (CIT).",
    icon: Building2,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "New Relief Options",
    description: "Enjoy 20% rent relief (up to ₦500k) and 100% deduction for assistive devices.",
    icon: Shield,
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "Modern VAT Framework",
    description: "Clearer zero-rated vs exempt categories with improved input tax credit mechanisms.",
    icon: Receipt,
    gradient: "from-amber-500 to-orange-600",
  },
];

const GUIDES = [
  {
    title: "Personal Income Tax (PIT)",
    subtitle: "For individuals & employees",
    items: [
      "Progressive bands: 0% to 25%",
      "Pension, NHF & NHIS deductions apply",
      "Rent relief: 20% (cap ₦500k)",
      "Minimum wage earners exempt"
    ],
    link: "/calculator/pit",
    icon: User,
    accentColor: "emerald"
  },
  {
    title: "Company Income Tax (CIT)",
    subtitle: "For businesses & corporations",
    items: [
      "0% for Small companies (<₦50M)",
      "30% standard rate",
      "15% Minimum Effective Tax Rate",
      "4% development levy applies"
    ],
    link: "/calculator/cit",
    icon: Building2,
    accentColor: "blue"
  },
  {
    title: "Value Added Tax (VAT)",
    subtitle: "For goods & services",
    items: [
      "Standard rate: 7.5%",
      "Input tax credit mechanism",
      "Exports are zero-rated",
      "Non-resident VAT rules apply"
    ],
    link: "/calculator/vat",
    icon: Receipt,
    accentColor: "purple"
  },
  {
    title: "Capital Gains Tax (CGT)",
    subtitle: "For asset disposals",
    items: [
      "10% on chargeable gains",
      "Exemptions for principal residence",
      "Roll-over relief available",
      "Integrated with PIT/CIT"
    ],
    link: "/calculator/cgt",
    icon: TrendingUp,
    accentColor: "amber"
  },
  {
    title: "Crypto Tax",
    subtitle: "For digital assets",
    items: [
      "Treated as chargeable assets",
      "CGT applies on disposal",
      "Trading income may attract PIT",
      "Record-keeping is essential"
    ],
    link: "/calculator/crypto",
    icon: Coins,
    accentColor: "orange"
  },
  {
    title: "Stamp Duties",
    subtitle: "For documents & transactions",
    items: [
      "Flat or ad valorem rates",
      "Electronic stamping available",
      "Exemptions for specific documents",
      "Penalties for late stamping"
    ],
    link: "/calculator/stamp-duties",
    icon: FileText,
    accentColor: "rose"
  },
];

const STATS = [
  { value: "₦800K", label: "Tax-Free Threshold" },
  { value: "₦50M", label: "Small Biz Exemption" },
  { value: "7.5%", label: "VAT Rate" },
  { value: "25%", label: "Max PIT Rate" },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#2d4a6f] to-[#1E3A5F]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-emerald-300 font-medium px-4 py-2 rounded-full mb-6"
            >
              <Globe className="w-4 h-4" />
              <span>Nigeria Tax Act 2025</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Master Your Taxes with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Confidence
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed"
            >
              The 2025 Tax Act brings significant changes. Understand your obligations, 
              maximize your savings, and stay compliant with our comprehensive guides.
            </motion.p>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-200/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Key Highlights */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-amber-600 font-semibold mb-4"
            >
              <Zap className="w-5 h-5 fill-amber-500" />
              <span>Key Highlights</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-[#1E3A5F]"
            >
              What&apos;s New in the 2025 Act
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BIG_WINS.map((win, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${win.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <win.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-[#1E3A5F]">{win.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {win.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tax Guides */}
        <section>
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4"
            >
              Tax Calculators & Guides
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Explore our suite of calculators designed to help you understand and compute your tax obligations accurately.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDES.map((guide, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full flex flex-col border border-slate-200 hover:border-[#1E3A5F]/30 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-[#1E3A5F] group-hover:text-emerald-600 transition-colors">
                          {guide.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{guide.subtitle}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-xl bg-${guide.accentColor}-100 flex items-center justify-center shrink-0`}>
                        <guide.icon className={`w-5 h-5 text-${guide.accentColor}-600`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <ul className="space-y-2.5">
                      {guide.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Link 
                      href={guide.link} 
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A5F] hover:text-emerald-600 transition-colors group/link"
                    >
                      Open Calculator
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Calculate Your Taxes?</h2>
          <p className="text-blue-100/80 max-w-xl mx-auto mb-8">
            Start with our Personal Income Tax calculator – the most used tool for Nigerian taxpayers.
          </p>
          <Link 
            href="/calculator/pit"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            Start PIT Calculator
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
