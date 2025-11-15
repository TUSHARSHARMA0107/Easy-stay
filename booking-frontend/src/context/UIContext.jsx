import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <UIContext.Provider
      value={{
        showLoginModal,
        setShowLoginModal,
        showReviewModal,
        setShowReviewModal,
        showConfirm,
        setShowConfirm,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);