"use client";
import React from "react";
import { WalletInfoSection } from './WalletInfoSection';
import { NavigationMenu } from './NavigationMenu';

interface DropdownContentProps {
  account: { address: string };
  chain: { id: number; name?: string; iconUrl?: string };
  openChainModal: () => void;
  onCloseDropdown: () => void;
}

export const DropdownContent: React.FC<DropdownContentProps> = ({
  account,
  chain,
  openChainModal,
  onCloseDropdown,
}) => {
  return (
    <>
      <WalletInfoSection
        account={account}
        chain={chain}
        openChainModal={openChainModal}
        onCloseDropdown={onCloseDropdown}
      />
      <NavigationMenu onCloseDropdown={onCloseDropdown} />
    </>
  );
};

