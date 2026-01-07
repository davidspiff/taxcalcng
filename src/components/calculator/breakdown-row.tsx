'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/tax-engine';
import { CitationTooltip } from '@/components/citation-tooltip';

interface BreakdownRowProps {
  label: string;
  value: number | string;
  /** Format as currency (default: true for numbers) */
  isCurrency?: boolean;
  /** Treat as plain text, overrides isCurrency */
  isText?: boolean;
  /** Show as deduction in parentheses */
  isDeduction?: boolean;
  /** Highlight color */
  variant?: 'default' | 'positive' | 'negative' | 'muted' | 'highlight';
  /** Indent level (0-3) */
  indent?: 0 | 1 | 2 | 3;
  /** Citation tooltip info */
  citation?: {
    section: string;
    title: string;
    description: string;
  };
  /** Additional info shown below the row */
  subtext?: string;
  /** Custom right-side content */
  rightContent?: ReactNode;
  /** Make the row stand out */
  isTotal?: boolean;
  /** Show percentage */
  percentage?: number;
  className?: string;
}

export function BreakdownRow({
  label,
  value,
  isCurrency = typeof value === 'number',
  isText = false,
  isDeduction = false,
  variant = 'default',
  indent = 0,
  citation,
  subtext,
  rightContent,
  isTotal = false,
  percentage,
  className,
}: BreakdownRowProps) {
  const indentClasses = {
    0: '',
    1: 'pl-4',
    2: 'pl-8',
    3: 'pl-12',
  };

  const variantClasses = {
    default: 'text-foreground',
    positive: 'text-emerald-600',
    negative: 'text-rose-600',
    muted: 'text-muted-foreground',
    highlight: 'text-primary font-semibold',
  };

  const formatValue = () => {
    if (typeof value === 'string' || isText) return value.toString();
    if (!isCurrency) return value.toString();
    
    const formatted = formatCurrency(Math.abs(value));
    if (isDeduction || value < 0) {
      return `(${formatted})`;
    }
    return formatted;
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between py-1.5',
        indentClasses[indent],
        isTotal && 'border-t border-border/60 pt-2 mt-1',
        className
      )}
    >
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {indent > 0 && (
          <span className="text-muted-foreground/40 text-xs">└</span>
        )}
        <span
          className={cn(
            'text-sm',
            isTotal ? 'font-semibold text-foreground' : 'text-muted-foreground',
            indent > 0 && 'text-xs'
          )}
        >
          {label}
        </span>
        {citation && (
          <CitationTooltip
            section={citation.section}
            title={citation.title}
            description={citation.description}
          />
        )}
        {percentage !== undefined && (
          <span className="text-xs text-muted-foreground/70 ml-1">
            ({percentage}%)
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {subtext && (
          <span className="text-xs text-muted-foreground">{subtext}</span>
        )}
        {rightContent || (
          <span
            className={cn(
              'font-mono text-sm',
              isTotal && 'text-base font-bold',
              variantClasses[variant],
              isDeduction && 'text-rose-500'
            )}
          >
            {formatValue()}
          </span>
        )}
      </div>
    </div>
  );
}

// Summary row with larger styling for final totals
interface SummaryRowProps {
  label: string;
  value: number;
  variant?: 'default' | 'success' | 'danger';
  subLabel?: string;
  className?: string;
}

export function SummaryRow({
  label,
  value,
  variant = 'default',
  subLabel,
  className,
}: SummaryRowProps) {
  const variantStyles = {
    default: 'bg-muted/50',
    success: 'bg-emerald-50 dark:bg-emerald-900/20',
    danger: 'bg-rose-50 dark:bg-rose-900/20',
  };

  const valueStyles = {
    default: 'text-foreground',
    success: 'text-emerald-600 dark:text-emerald-400',
    danger: 'text-rose-600 dark:text-rose-400',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg',
        variantStyles[variant],
        className
      )}
    >
      <div>
        <span className="font-semibold text-foreground">{label}</span>
        {subLabel && (
          <p className="text-xs text-muted-foreground mt-0.5">{subLabel}</p>
        )}
      </div>
      <span className={cn('font-mono font-bold text-2xl', valueStyles[variant])}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}

// Tax band row for showing progressive tax breakdown
interface TaxBandRowProps {
  band: string;
  rate: number | string;
  taxableAmount: number;
  tax: number;
  isExempt?: boolean;
}

export function TaxBandRow({ band, rate, taxableAmount, tax, isExempt = false }: TaxBandRowProps) {
  return (
    <div className="grid grid-cols-4 gap-2 py-1.5 text-sm border-b border-border/30 last:border-0">
      <span className="text-muted-foreground">{band}</span>
      <span className="font-mono text-center">
        {isExempt ? (
          <span className="text-emerald-600 text-xs">EXEMPT</span>
        ) : (
          typeof rate === 'number' ? `${rate}%` : rate
        )}
      </span>
      <span className="font-mono text-right text-muted-foreground">
        {formatCurrency(taxableAmount)}
      </span>
      <span className={cn('font-mono text-right font-medium', tax === 0 ? 'text-emerald-600' : 'text-foreground')}>
        {formatCurrency(tax)}
      </span>
    </div>
  );
}

// Header row for tax band table
export function TaxBandHeader() {
  return (
    <div className="grid grid-cols-4 gap-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/60">
      <span>Band</span>
      <span className="text-center">Rate</span>
      <span className="text-right">Amount</span>
      <span className="text-right">Tax</span>
    </div>
  );
}
