"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import { useUIStore } from "@/app/store/uiStore";
import { useLogout } from "@/app/hooks/useAuth";
import { supabase } from "@/app/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Home, Film, User, Search } from "lucide-react";
import SearchDialog from "./SearchDialog";
import Logo from "./Logo";
import ScrollProgressBar from "./ScrollProgressBar";

// NavLink component for navigation items
const NavLink = ({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Navbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { openSearch } = useUIStore();
  const logout = useLogout();
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileData, setProfileData] = useState<{
    avatar_url: string | null;
  } | null>(null);

  // Fetch current user's profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();

        if (data && !error) {
          setProfileData(data);
          console.log("Profile data fetched:", data);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  // Debug auth state
  useEffect(() => {
    console.log("Navbar auth state:", {
      isAuthenticated,
      isLoading,
      user,
      profileData,
    });
  }, [isAuthenticated, isLoading, user, profileData]);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        console.log("Search shortcut detected in Navbar!");
        e.preventDefault();
        e.stopPropagation();
        // Force open the search dialog
        openSearch();
      }
    };

    // Use capture phase to catch the event before other handlers
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [openSearch]);

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
    <>
      <SearchDialog />

      <nav
        className={`fixed top-0 w-full z-50 px-4 md:px-6 py-3 transition-all duration-300 shadow-2xl ${
          isScrolled
            ? "bg-background/90 backdrop-blur-sm shadow-sm"
            : "bg-gradient-to-b from-background/95 to-background/60 backdrop-blur-sm"
        }`}
      >
        <section className="container mx-auto flex items-center justify-between">
          <ScrollProgressBar />
          <div className="flex items-center gap-6">
            <div className="relative z-10">
              <Logo size="md" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary/10 rounded-full blur-xl"></div>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <NavLink
                href="/"
                label="Home"
                icon={<Home className="w-4 h-4" />}
                active={pathname === "/"}
              />
              <NavLink
                href="/movies/popular"
                label="Movies"
                icon={<Film className="w-4 h-4" />}
                active={pathname.includes("/movies")}
              />
              <NavLink
                href="/actors/popular"
                label="Actors"
                icon={<User className="w-4 h-4" />}
                active={pathname.includes("/actors")}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Improved search button that opens the search dialog */}
            <button
              onClick={() => {
                console.log("Search button clicked");
                openSearch();
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted rounded-full text-sm text-muted-foreground transition-all duration-200 w-72 lg:w-80 border border-transparent hover:border-primary/20 group"
            >
              <Search className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
              <span className="flex-1 text-left">Search movies, actors...</span>
              <div className="flex items-center gap-1 text-xs bg-background/50 px-1.5 py-0.5 rounded-md">
                <kbd className="px-1.5 py-0.5 bg-background rounded text-[10px] font-mono border border-muted-foreground/20">
                  {typeof window !== "undefined" &&
                  navigator?.userAgent?.indexOf("Mac") !== -1
                    ? "⌘"
                    : "Ctrl"}
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-background rounded text-[10px] font-mono border border-muted-foreground/20">
                  K
                </kbd>
              </div>
            </button>

            {/* Mobile search icon */}
            <button
              onClick={openSearch}
              className="sm:hidden p-2 rounded-full hover:bg-primary/10 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-primary" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-primary/10 transition-colors">
                      <Avatar className="h-8 w-8 border-2 border-primary/30 hover:border-primary transition-colors ring-2 ring-background">
                        <AvatarImage
                          src={
                            profileData?.avatar_url ||
                            user?.avatar_url ||
                            undefined
                          }
                          alt={user?.email || "User"}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-white font-medium">
                          {user?.email
                            ? user.email.charAt(0).toUpperCase()
                            : "U"}
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
                  <PopoverContent className="w-72 p-0 bg-card/95 backdrop-blur-sm border border-primary/20 rounded-xl shadow-lg shadow-primary/5 overflow-hidden">
                    <div className="flex flex-col">
                      <div className="p-4 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-primary/30 ring-2 ring-background hover:border-primary transition-colors">
                            <AvatarImage
                              src={
                                profileData?.avatar_url ||
                                user?.avatar_url ||
                                undefined
                              }
                              alt={user?.email || "User"}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-white font-medium">
                              {user?.email
                                ? user.email.charAt(0).toUpperCase()
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">
                              {user?.email?.split("@")[0]}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </p>
                            <div className="mt-1 flex items-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-green-500/10 text-primary">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1 animate-pulse"></span>
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 p-2.5 text-sm rounded-lg hover:bg-primary/10 transition-colors w-full text-left group"
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
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
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                              />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">Profile</span>
                            <span className="text-xs text-muted-foreground">
                              Manage your account
                            </span>
                          </div>
                        </Link>

                        <Link
                          href="/watchlist"
                          className="flex items-center gap-3 p-2.5 text-sm rounded-lg hover:bg-primary/10 transition-colors w-full text-left group"
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
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
                                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">Watchlist</span>
                            <span className="text-xs text-muted-foreground">
                              Movies you&apos;ve saved
                            </span>
                          </div>
                        </Link>

                        <Link
                          href="/reviews"
                          className="flex items-center gap-3 p-2.5 text-sm rounded-lg hover:bg-primary/10 transition-colors w-full text-left group"
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
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
                                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                              />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">Reviews</span>
                            <span className="text-xs text-muted-foreground">
                              Your movie reviews
                            </span>
                          </div>
                        </Link>

                        <div className="h-px bg-primary/10 my-2"></div>

                        <button
                          onClick={() => logout.mutate()}
                          className="flex items-center gap-3 p-2.5 text-sm rounded-lg hover:bg-red-500/10 transition-colors w-full text-left text-purple-500 group"
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/10 text-purple-500 group-hover:bg-red-500/20 transition-colors">
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
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                              />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">Sign Out</span>
                            <span className="text-xs text-purple-500/70">
                              Log out of your account
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200 rounded-full px-4 font-medium"
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:from-purple-500 hover:via-violet-500 hover:to-pink-400 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 rounded-full px-5 font-medium"
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </nav>
    </>
  );
};

export default Navbar;
