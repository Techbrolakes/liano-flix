"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLogout } from "@/app/hooks/useAuth";
import { useAuthStore } from "@/app/store/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const logout = useLogout();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Debug auth state
  useEffect(() => {
    console.log('Navbar auth state:', { isAuthenticated, isLoading, user });
  }, [isAuthenticated, isLoading, user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 px-4 md:px-6 py-3 flex items-center justify-between transition-colors duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-sm border-b "
          : "bg-gradient-to-b from-background/90 to-transparent"
      }`}
    >
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-primary font-bold text-2xl">LianoFlix</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <NavLink href="/" label="Home" active={pathname === "/"} />
          <NavLink
            href="/movies/popular"
            label="Movies"
            active={pathname.includes("/movies")}
          />
          <NavLink
            href="/actors/popular"
            label="Actors"
            active={pathname.includes("/actors")}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block w-64">
          <SearchBar />
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 focus:outline-none">
                  <Avatar className="h-8 w-8 border-2 border-primary/20 hover:border-primary/50 transition-colors">
                    <AvatarImage src={user?.avatar_url || undefined} alt={user?.email || "User"} />
                    <AvatarFallback className="bg-neutral-800 text-primary">
                      {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-muted-foreground"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-card/95 backdrop-blur-sm border border-neutral-800">
                <div className="flex flex-col">
                  <div className="p-4 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar_url || undefined} alt={user?.email || "User"} />
                        <AvatarFallback className="bg-neutral-800 text-primary">
                          {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user?.email?.split('@')[0]}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-2 p-2 text-sm rounded-md hover:bg-accent transition-colors w-full text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      Profile
                    </Link>
                    
                    <Link 
                      href="/watchlist" 
                      className="flex items-center gap-2 p-2 text-sm rounded-md hover:bg-accent transition-colors w-full text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                      Watchlist
                    </Link>
                    
                    <button
                      onClick={() => logout.mutate()}
                      className="flex items-center gap-2 p-2 text-sm rounded-md hover:bg-accent transition-colors w-full text-left text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

// NavLink component for navigation items
const NavLink = ({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition ${
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
};

export default Navbar;
