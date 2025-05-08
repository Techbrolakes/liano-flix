"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLogout } from "@/app/hooks/useAuth";
import { useAuthStore } from "@/app/store/authStore";
import { useUIStore } from "@/app/store/uiStore";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { toggleSidebar } = useUIStore();
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
      className={`fixed top-0 w-full z-50 px-4 md:px-6 py-4 flex items-center justify-between transition-colors duration-300 ${
        isScrolled
          ? "bg-black bg-opacity-90"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-white p-2 rounded-full hover:bg-white/10 transition lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <Link href="/" className="flex items-center gap-2">
          <span className="text-red-600 font-bold text-2xl">LianoFlix</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 ml-10">
          <NavLink href="/" label="Home" active={pathname === "/"} />
          <NavLink
            href="/movies"
            label="Movies"
            active={pathname.includes("/movies")}
          />
          <NavLink
            href="/actors"
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
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden">
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

              <div className="absolute right-0 mt-2 w-48 bg-neutral-900 rounded-md shadow-lg overflow-hidden z-50 scale-0 origin-top-right group-hover:scale-100 transition-transform duration-200">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-neutral-800">
                    {user?.email}
                  </div>
                  <button
                    onClick={() => logout.mutate()}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-800 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm text-white hover:bg-white/10 rounded transition"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition"
            >
              Sign Up
            </Link>
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
        active ? "text-white" : "text-gray-300 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
};

export default Navbar;
