'use client';

import React from 'react';
import {
  displayNodeId,
  displayReferrer,
} from '@/lib/bindDisplay';
import BindInfoRow from './BindInfoRow';

interface BindInfoCardProps {
  referrer: string | null | undefined;
  referrerNode: string | null | undefined;
  labels: {
    referrer: string;
    referrerNode: string;
    unbound: string;
    none: string;
  };
}

const BindInfoCard: React.FC<BindInfoCardProps> = ({
  referrer,
  referrerNode,
  labels,
}) => {
  const unbound = labels.unbound;
  const none = labels.none;

  return (
    <div className="rounded-2xl md:rounded-xl overflow-hidden">
      <BindInfoRow
        label={labels.referrer}
        rawValue={referrer}
        displayValue={displayReferrer(referrer, { unbound })}
        unboundLabel={unbound}
        noneLabel={none}
      />
      <div className="h-px bg-white/10 mx-4 md:mx-5" />
      <BindInfoRow
        label={labels.referrerNode}
        rawValue={referrerNode}
        displayValue={displayNodeId(referrerNode, { none })}
        unboundLabel={unbound}
        noneLabel={none}
      />
    </div>
  );
};

export default BindInfoCard;
