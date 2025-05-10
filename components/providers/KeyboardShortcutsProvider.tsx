"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type KeyboardShortcutsContextType = {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
};

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        console.log("Search shortcut detected in provider");
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    // Add event listener with capture phase to catch it early
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return (
    <KeyboardShortcutsContext.Provider value={{ isSearchOpen, setIsSearchOpen }}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (context === undefined) {
    throw new Error("useKeyboardShortcuts must be used within a KeyboardShortcutsProvider");
  }
  return context;
}
