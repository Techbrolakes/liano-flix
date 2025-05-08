"use client";

import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";

export function ActorSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );

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
    <div className="w-full max-w-lg mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search for actors..."
          value={searchQuery}
          onChange={handleChange}
          className="pr-10"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
