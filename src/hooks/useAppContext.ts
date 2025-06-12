
"use client";

import { AppContext } from '@/contexts/AppContext';
import { useContext } from 'react';

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
