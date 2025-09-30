import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  searchQuery: string;
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      searchQuery: '',
      isSidebarOpen: false,
      isSearchOpen: false,
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      openSearch: () => {
        console.log('openSearch called in uiStore');
        set({ isSearchOpen: true });
      },
      closeSearch: () => {
        console.log('closeSearch called in uiStore');
        set({ isSearchOpen: false });
      },
      toggleSearch: () => {
        console.log('toggleSearch called in uiStore');
        set((state) => {
          const newState = !state.isSearchOpen;
          console.log(`Search state toggled from ${state.isSearchOpen} to ${newState}`);
          return { isSearchOpen: newState };
        });
      },
    }),
    {
      name: 'olamax-ui-storage',
    }
  )
);
