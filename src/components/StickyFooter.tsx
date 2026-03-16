import React from 'react';
import { Button } from './Button';

type StickyFooterProps = {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  backLabel?: string;
  price?: number;
};

export function StickyFooter({
  onBack,
  onNext,
  nextLabel,
  nextDisabled = false,
  backDisabled = false,
  backLabel = 'Back',
  price,
}: StickyFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 transition-transform duration-300">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {onBack && (
          <div className="flex-shrink-0">
             <Button 
               variant="secondary" 
               onClick={onBack} 
               disabled={backDisabled}
               className="!px-6"
             >
               {backLabel}
             </Button>
          </div>
        )}
        
        <div className="flex-1 flex justify-end items-center gap-4">
          {price !== undefined && (
             <div className="text-right hidden sm:block">
               <span className="text-xs text-gray-500 block">Total</span>
               <span className="text-lg font-bold text-gray-900">₹{price}</span>
             </div>
          )}
          <Button 
            variant="primary" 
            onClick={onNext} 
            disabled={nextDisabled}
            className="flex-1 sm:flex-none sm:min-w-[200px]"
          >
            {price !== undefined && <span className="sm:hidden mr-2">₹{price} |</span>} {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
