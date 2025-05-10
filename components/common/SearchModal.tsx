"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useKeyboardShortcuts } from "@/components/providers/KeyboardShortcutsProvider";

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useKeyboardShortcuts();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  }, [searchQuery, router, setIsSearchOpen]);

  // Handle Escape key inside the modal
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  }, [setIsSearchOpen]);

  useEffect(() => {
    // Focus the input when modal opens
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  return (
    <>
      {/* Debug button - visible only during development */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsSearchOpen(true)}
          className="text-xs bg-neutral-900 border-neutral-700"
        >
          Open Search (Cmd+K)
        </Button>
      </div>
      
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col gap-4 p-2">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for movies..."
                className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  } else {
                    handleKeyDown(e);
                  }
                }}
                autoFocus
              />
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <kbd className="px-2 py-1 bg-neutral-800 rounded">↵</kbd>
                <span>to search</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-neutral-500 px-2">
              <div>
                Press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">ESC</kbd> to close
              </div>
              <div>
                <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">Cmd</kbd> + <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">K</kbd> to open search
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
