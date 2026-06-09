"use client";

import React, { createContext, useContext, useState } from 'react';
import { GlobalState } from '@/types';
import { initialMockData } from '@/lib/mockData';

interface GlobalContextProps {
  state: GlobalState;
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state] = useState<GlobalState>(initialMockData);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <GlobalContext.Provider value={{
      state,
      isContactModalOpen,
      openContactModal: () => setIsContactModalOpen(true),
      closeContactModal: () => setIsContactModalOpen(false),
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobal must be used within a GlobalProvider');
  return context;
};
