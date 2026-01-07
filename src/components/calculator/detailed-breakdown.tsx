'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DetailedBreakdownProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  icon?: ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'info';
}

export function DetailedBreakdown({
  title,
  description,
  children,
  defaultOpen = false,
  className,
  headerClassName,
  icon,
  badge,
  badgeVariant = 'default',
}: DetailedBreakdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const badgeColors = {
    default: 'bg-gray-100/80 text-gray-700 dark:bg-gray-800/80 dark:text-gray-300',
    success: 'bg-emerald-50/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-50/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    info: 'bg-blue-50/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <div className={cn('bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-border/40 rounded-2xl overflow-hidden transition-all duration-300', isOpen ? 'shadow-md' : 'shadow-sm hover:shadow-md', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-5 text-left transition-all duration-200',
          isOpen ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-muted/40',
          headerClassName
        )}
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-foreground/90">{title}</span>
              {badge && (
                <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg', badgeColors[badgeVariant])}>
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground font-medium opacity-80 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-tight">
            {isOpen ? 'Minimize' : 'Expand'}
          </span>
          <div className={cn('p-1.5 rounded-full transition-transform duration-300 bg-muted/60', isOpen && 'rotate-180')}>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-2 border-t border-border/20">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compound components for structured breakdowns
interface BreakdownSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function BreakdownSection({ title, children, className }: BreakdownSectionProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-3 first:pt-0">
          {title}
        </h4>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
