"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLogout } from "@/app/hooks/useAuth";
import { useAuthStore } from "@/app/store/authStore";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();
  const [isScrolled, setIsScrolled] = useState(false);

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
          ? "bg-background/90 backdrop-blur-sm border-b border-border"
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
            <div className="relative group">
              <button className="flex items-center gap-2 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {user?.email ? (
                    <span className="uppercase text-sm font-bold">
                      {user.email.charAt(0)}
                    </span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  )}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg overflow-hidden z-50 scale-0 origin-top-right group-hover:scale-100 transition-transform duration-200 border border-border">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                    {user?.email}
                  </div>
                  <button
                    onClick={() => logout.mutate()}
                    className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
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
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
};

export default Navbar;
