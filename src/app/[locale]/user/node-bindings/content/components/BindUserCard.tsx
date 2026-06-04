'use client';

import React from 'react';
import BindUserRow from './BindUserRow';
import { displayReferrer } from '@/lib/bindDisplay';
import type { BindUserListItem } from '@/service/node';

interface BindUserCardProps {
  user: BindUserListItem;
  labels: {
    userWallet: string;
    referrerWallet: string;
    unbound: string;
    none: string;
  };
}

const BindUserCard: React.FC<BindUserCardProps> = ({ user, labels }) => {
  const { unbound, none } = labels;

  return (
    <div className="rounded-2xl md:rounded-xl overflow-hidden">
      <BindUserRow
        label={labels.userWallet}
        rawValue={user.id}
        displayValue={displayReferrer(user.id, { unbound })}
        unboundLabel={unbound}
        noneLabel={none}
      />
      <div className="h-px bg-white/10 mx-4 md:mx-5" />
      <BindUserRow
        label={labels.referrerWallet}
        rawValue={user.referrer}
        displayValue={displayReferrer(user.referrer, { unbound })}
        unboundLabel={unbound}
        noneLabel={none}
      />
    </div>
  );
};

export default BindUserCard;
