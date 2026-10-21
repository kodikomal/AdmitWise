import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('admitwise_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('admitwise_compare', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (college) => {
    if (!college || !college._id) return { success: false, message: 'Invalid college' };

    if (compareList.some((item) => item._id === college._id)) {
      return { success: false, message: 'College is already in comparison.' };
    }

    if (compareList.length >= 4) {
      return { success: false, message: 'You can compare a maximum of 4 colleges at a time.' };
    }

    setCompareList((prev) => [...prev, college]);
    return { success: true, message: `${college.name} added to comparison.` };
  };

  const removeFromCompare = (collegeId) => {
    setCompareList((prev) => prev.filter((c) => c._id !== collegeId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (collegeId) => {
    return compareList.some((c) => c._id === collegeId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        compareCount: compareList.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
