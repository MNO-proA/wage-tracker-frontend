// src/Context/DateContext.jsx

import React, { createContext, useState, useContext } from 'react';

// Create the context
export const DateContext = createContext();

// Create a provider component
export const DateProvider = ({ children }) => {
  const [date, setDate] = useState('');

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};

// Custom hook to use the date context
export const useDateContext = () => {
  return useContext(DateContext);
};
