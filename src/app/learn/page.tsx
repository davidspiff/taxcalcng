'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle2, Info, ArrowRight, Zap, GraduationCap, Scale, Building2, User } from 'lucide-react';
import Link from 'next/link';

const BIG_WINS = [
  {
    title: "Higher Tax-Free Threshold",
    description: "Individuals earning up to ₦800,000 annually now pay 0% PIT, up from the previous much lower limit.",
    icon: User,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Small Business Exemption",
    description: "Companies with an annual turnover of less than ₦50 million are fully exempt from Company Income Tax (CIT).",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Rent & Disability Relief",
    description: "Enjoy tax deductions for 20% of your annual rent (up to ₦500k) and 100% of costs for assistive devices.",
    icon: Scale,
    color: "text-purple-600",
    bg: "bg-purple-50",
  }
];

const GUIDES = [
  {
    title: "Individual Tax (PIT)",
    items: [
      "Bands are progressive: 0% to 25% under 2025 Act",
      "Calculated after Pension, NHF and NHIS deductions",
      "Rent relief: 20% of annual rent (cap ₦500k)",
      "Minimum wage earners are fully exempt"
    ],
    link: "/calculator/pit"
  },
  {
    title: "Business Tax (CIT)",
    items: [
      "0% for Small companies (< ₦50M turnover)",
      "30% for Standard companies",
      "Minimum Effective Tax Rate: 15%",
      "Development levy: 4% (excludes small and non-resident companies)"
    ],
    link: "/calculator/cit"
  },
  {
    title: "Value Added Tax (VAT)",
    items: [
      "Standard rate is 7.5%",
      "Input tax can be credited against output tax",
      "Exempt vs Zero-rated categories differ by law",
      "Exports are zero-rated; non-resident supplier VAT may be withheld"
    ],
    link: "/calculator/vat"
  }
];

export default function LearnPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-[#1E3A5F] text-white py-16 mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-emerald-400 font-semibold mb-4"
            >
              <GraduationCap className="w-6 h-6" />
              <span>Tax Education Hub</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Understanding the <br />
              <span className="text-emerald-400">Nigeria Tax Act 2025</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-blue-100 opacity-90 leading-relaxed"
            >
              The 2025 Act represents a significant shift towards a simpler, fairer, and more modern tax system. 
              Our goal is to make these laws accessible to every Nigerian citizen and business owner.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Big Wins Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#1E3A5F] mb-8 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            Key Highlights of the 2025 Act
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {BIG_WINS.map((win, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className={`w-12 h-12 rounded-xl ${win.bg} ${win.color} flex items-center justify-center mb-4`}>
                      <win.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl text-[#1E3A5F]">{win.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {win.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Guides Section */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {GUIDES.map((guide, i) => (
              <Card key={i} className="flex flex-col border-dashed hover:border-solid hover:border-[#1E3A5F]/40 transition-all">
                <CardHeader>
                  <CardTitle className="text-lg text-[#1E3A5F]">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <ul className="space-y-3">
                    {guide.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground leading-snug">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link href={guide.link} className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A5F] hover:text-emerald-600 transition-colors">
                    Use Calculator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
