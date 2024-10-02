import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ErrorContextType = {
  error: string | null;
  setError: (message: string | null) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if(error) {
        setTimeout(() => {setError(null)},2000)
    }
  },[error])
  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};