'use client';

import React from 'react';
import { CopyButton } from '@/components/copy-button';
import { canCopyBindValue } from '@/lib/bindDisplay';

interface BindInfoRowProps {
  label: string;
  rawValue: string | null | undefined;
  displayValue: string;
  unboundLabel: string;
  noneLabel: string;
}

const BindInfoRow: React.FC<BindInfoRowProps> = ({
  label,
  rawValue,
  displayValue,
  unboundLabel,
  noneLabel,
}) => {
  const isPlaceholder = displayValue === unboundLabel || displayValue === noneLabel;
  const showCopy = canCopyBindValue(rawValue, displayValue, {
    unbound: unboundLabel,
    none: noneLabel,
  });

  return (
    <div className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-5 min-h-[3.25rem] md:min-h-[3.5rem]">
      <span className="w-20 md:w-24 shrink-0 text-sm md:text-base text-white/60">{label}</span>
      <span
        className={`flex-1 text-right text-sm md:text-base font-semibold truncate tabular-nums ${
          isPlaceholder ? 'text-white/35' : 'text-white'
        }`}
      >
        {displayValue}
      </span>
      {showCopy && rawValue ? (
        <CopyButton
          text={rawValue.trim()}
          className="shrink-0 text-cyan-400/90 hover:text-cyan-300 cursor-pointer transition-colors duration-200 relative p-1.5"
          iconSize="sm"
        />
      ) : (
        <span className="w-7 shrink-0" aria-hidden />
      )}
    </div>
  );
};

export default BindInfoRow;
