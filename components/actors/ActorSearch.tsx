"use client";

import React, { useState, useCallback, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { MovieInfoSkeleton } from "../skeletons";

export function ActorSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Debounced function to update URL with search query
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateQuery = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300),
    [pathname, router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedUpdateQuery(searchQuery);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedUpdateQuery(value);
  };

  return (
    <Suspense fallback={<MovieInfoSkeleton />}>
      <div className="w-full max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative group">
            <Input
              type="text"
              placeholder="Search for actors..."
              value={searchQuery}
              onChange={handleChange}
              className="pr-14 bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary/40 focus:ring-primary/20 rounded-lg pl-4 h-11 transition-all duration-300"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md bg-primary/5 hover:bg-primary/10 text-primary transition-all duration-300"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </Suspense>
  );
}
