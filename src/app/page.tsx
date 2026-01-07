'use client';


import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, ShieldCheck, FileText, PieChart, Coins, Building2, Plane, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100
    }
  }
};

const calculators = [
  {
    href: '/calculator/pit',
    title: 'Personal Income Tax (PIT)',
    description:
      'Compare your income under the old 2024 regime vs the new 2025 Act and see your savings instantly.',
    icon: Coins,
    badge: 'Flagship tool',
  },
  {
    href: '/calculator/cit',
    title: 'Company Income Tax',
    description: 'Check if your business qualifies for 0% tax and estimate your total CIT burden.',
    icon: Building2,
  },
  {
    href: '/calculator/cgt',
    title: 'Capital Gains Tax',
    description: 'Calculate tax on disposals and see which exemptions apply under the 2025 Act.',
    icon: TrendingUp,
  },
  {
    href: '/calculator/vat',
    title: 'VAT Calculator',
    description: 'Standard 7.5% VAT with quick access to exempt and zero-rated categories.',
    icon: FileText,
  },
  {
    href: '/calculator/crypto',
    title: 'Crypto Tax',
    description: 'Apply Nigeria’s rules to digital assets with loss offset and reporting hints.',
    icon: ShieldCheck,
  },
  {
    href: '/calculator/remote-work',
    title: 'Remote Work & "Japa" Tax',
    description: 'Model foreign income and section 13 exemptions for Nigerians earning abroad.',
    icon: Plane,
  },
  {
    href: '/calculator/stamp-duties',
    title: 'Stamp Duties',
    description: 'Check Ninth Schedule rates for leases, mortgages, share transfers and more.',
    icon: ScrollText,
  },
];

export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col gap-16 pb-20">
      
      {/* Modern Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary font-medium text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Updated for Nigeria Tax Act 2025
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
              Master Your Taxes with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                Intelligence
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              The definitive platform for Nigerian taxation. Compare the old 2024 regime vs the new 2025 Act instantly. Precision-engineered for individuals and businesses.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculator/pit">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                  Calculate Savings Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#calculators">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50 backdrop-blur-sm">
                  Explore Tools
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Calculators Grid */}
      <section id="calculators" className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Tax Calculators</h2>
            <p className="text-muted-foreground">Start with PIT, then explore company, gains, VAT, and specialist tools.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {calculators.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <Card
                className={`h-full border border-border/60 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-xl ${
                  tool.badge ? 'bg-gradient-to-br from-primary/5 to-transparent border-primary/30' : ''
                }`}
              >
                <CardHeader className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/15 transition-transform">
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-lg font-semibold">{tool.title}</CardTitle>
                      {tool.badge && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-700">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm font-medium text-primary">
                    Open calculator
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Specialized Tools & Coming Soon */}
      <section className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Specialized & Enterprise Tools</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Petroleum Tax",
              "Mining Royalties",
              "Insurance Tax", 
              "Gaming & Lottery Tax"
            ].map((item) => (
              <div key={item} className="group relative overflow-hidden rounded-xl border bg-card p-4 hover:border-primary/50 transition-colors cursor-not-allowed opacity-80">
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-medium text-sm">{item}</span>
                  <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-1 rounded-full">Coming Soon</span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Live Stats / Highlights */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <PieChart className="w-96 h-96 -mr-20 -mt-20" />
          </div>
          
          <div className="relative z-10 grid md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <div className="text-4xl font-bold mb-2">₦800K</div>
              <div className="text-primary-foreground/80 font-medium">Tax-Free Threshold</div>
              <div className="text-sm text-primary-foreground/60 mt-1">Increased from ₦300k</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">0%</div>
              <div className="text-primary-foreground/80 font-medium">Small Biz Tax</div>
              <div className="text-sm text-primary-foreground/60 mt-1">For turnover &lt; ₦50M</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-primary-foreground/80 font-medium">Max PIT Rate</div>
              <div className="text-sm text-primary-foreground/60 mt-1">For income &gt; ₦50M</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-foreground/80 font-medium">Privacy</div>
              <div className="text-sm text-primary-foreground/60 mt-1">Client-side only</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
