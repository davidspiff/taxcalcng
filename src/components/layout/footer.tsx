import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold text-primary">TaxPlan</span>
              <span className="text-xl font-bold text-emerald-500">Nigeria</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              The definitive Tax Intelligence Platform for Nigeria. Calculate, compare, and optimize 
              your taxes under the Nigeria Tax Act 2025.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Calculators</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/calculator/pit" className="hover:text-primary transition-colors">Personal Income Tax</Link></li>
              <li><Link href="/calculator/cit" className="hover:text-primary transition-colors">Company Income Tax</Link></li>
              <li><Link href="/calculator/cgt" className="hover:text-primary transition-colors">Capital Gains Tax</Link></li>
              <li><Link href="/calculator/vat" className="hover:text-primary transition-colors">VAT Calculator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Use</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TaxPlan Nigeria. Based on Nigeria Tax Act 2025.</p>
          <p className="mt-2 text-xs opacity-70">
            Disclaimer: This tool is for informational purposes only and does not constitute tax advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
