'use client';

import { Moon, Sun, Menu, BookOpen } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Learn', href: '/learn' },
  { name: 'PIT Calculator', href: '/calculator/pit' },
  { name: 'CIT Calculator', href: '/calculator/cit' },
  { name: 'CGT Calculator', href: '/calculator/cgt' },
  { name: 'VAT Calculator', href: '/calculator/vat' },
  { name: 'Crypto Tax', href: '/calculator/crypto' },
  { name: 'Remote Work', href: '/calculator/remote-work' },
  { name: 'Stamp Duties', href: '/calculator/stamp-duties' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const calculators = navigation.filter((item) => item.href.startsWith('/calculator'));

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">TaxPlan</span>
            <span className="text-2xl font-bold text-emerald-500">Nigeria</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-3">
          <Link
            href="/learn"
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2',
              pathname === '/learn'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
            )}
          >
            <BookOpen className="h-4 w-4" />
            Learn
          </Link>

          <Select
            value={pathname.startsWith('/calculator') ? pathname : ''}
            onValueChange={(value) => router.push(value)}
          >
            <SelectTrigger className="w-56 text-sm">
              <SelectValue placeholder="Select a calculator" />
            </SelectTrigger>
            <SelectContent>
              {calculators.map((item) => (
                <SelectItem key={item.href} value={item.href}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-1">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="lg:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'px-4 py-3 text-lg font-medium rounded-lg transition-colors',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
