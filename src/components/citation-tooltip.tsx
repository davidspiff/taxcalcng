import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CitationTooltipProps {
  section: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export function CitationTooltip({
  section,
  title,
  description,
  children,
  className,
}: CitationTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className={cn("inline-flex items-center gap-1 cursor-help", className)}>
            {children}
            <Info className="h-4 w-4 text-muted-foreground/70 hover:text-primary transition-colors" />
          </span>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xl p-4 rounded-xl"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-white/20 pb-2">
              <span className="font-semibold text-xs tracking-wider text-[#F39C12]">
                {section}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
