'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Printer } from 'lucide-react';
import { PDFContent, downloadPDF } from '@/lib/pdf-generator';

interface PDFDownloadButtonProps {
  content: PDFContent;
  filename?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export function PDFDownloadButton({
  content,
  filename,
  variant = 'outline',
  size = 'default',
  className,
  showIcon = true,
  label = 'Download PDF',
}: PDFDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await downloadPDF(content, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
      console.error('PDF generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={handleDownload}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            {showIcon && <Printer className="w-4 h-4 mr-2" />}
            {label}
          </>
        )}
      </Button>
      {error && (
        <p className="absolute top-full left-0 mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

// Compact version for inline use
export function PDFDownloadIconButton({
  content,
  filename,
  className,
}: Pick<PDFDownloadButtonProps, 'content' | 'filename' | 'className'>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await downloadPDF(content, filename);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDownload}
      disabled={isLoading}
      className={className}
      title="Download PDF Report"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
    </Button>
  );
}
