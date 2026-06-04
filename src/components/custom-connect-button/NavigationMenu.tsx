"use client";
import React from "react";
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useDisconnect } from "wagmi";
import { BIND_RELATIONS_PATH } from '@/constants/userRoutes';

interface NavigationMenuProps {
  onCloseDropdown: () => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ onCloseDropdown }) => {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const tCommon = useTranslations('common');

  const handleNavigation = (path: string) => {
    router.push(path);
    onCloseDropdown();
  };

  const handleDisconnect = () => {
    localStorage.removeItem('userConnected');
    disconnect();
    onCloseDropdown();
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="py-2 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/30 hover:scrollbar-thumb-white/50 max-h-[300px] md:max-h-[300px]">
        {/* <button 
          className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
          onClick={() => handleNavigation("/user")}
        >
          {tCommon('wallet.userCenter')}
        </button> */}
        
        <button
          className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
          onClick={() => handleNavigation(BIND_RELATIONS_PATH)}
        >
          {tCommon('wallet.bindRelations')}
        </button>

        <button 
          className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
          onClick={() => handleNavigation("/user/network?tab=nodes")}
        >
          {tCommon('wallet.myNodes')}
        </button>
        
        <button 
          className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
          onClick={() => handleNavigation("/user/my-tickets")}
        >
          {tCommon('wallet.holdLottery')}
        </button>
        
        <button 
          className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
          onClick={() => handleNavigation("/user/winning-records")}
        >
          {tCommon('wallet.winningRecords')}
        </button>
        
        <button 
          className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
          onClick={() => handleNavigation("/user/donation-records")}
        >
          {tCommon('wallet.donationRecords')}
        </button>
      </div>
      
      <div className="border-t border-white/10 pt-2 pb-2">
        <button 
          className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-red-400 cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-red-400/20 active:to-red-400/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-red-400/10 md:hover:to-red-400/5 md:hover:text-red-300"
          onClick={handleDisconnect}
        >
          {tCommon('wallet.disconnect')}
        </button>
      </div>
    </div>
  );
};

