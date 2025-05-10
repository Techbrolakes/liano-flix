"use client";

import { Suspense } from "react";
import { ActorCatalogue } from "@/components/actors/ActorCatalogue";
import { ActorSearch } from "@/components/actors/ActorSearch";
import { useSearchParams } from "next/navigation";
import { usePopularActors, useSearchActors } from "@/app/hooks/useActorQueries";

function ActorCatalogueSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[2/3] bg-muted rounded-md mb-2" />
          <div className="h-4 bg-muted rounded mb-1 w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

function PopularActorsContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  const { data: popularData, isLoading: isLoadingPopular } =
    usePopularActors(1);

  const { data: searchData, isLoading: isLoadingSearch } = useSearchActors(
    query,
    1
  );

  const isLoading = query ? isLoadingSearch : isLoadingPopular;
  const data = query ? searchData : popularData;

  if (isLoading || !data) {
    return <ActorCatalogueSkeleton />;
  }

  return <ActorCatalogue initialActors={data.results} searchQuery={query} />;
}

// Main page component that doesn't use any client hooks directly
export default function Page() {
  return (
    <Suspense fallback={<ActorCatalogueSkeleton />}>
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced header section with gradient background */}
        <div className="mb-8 rounded-xl bg-gradient-from-card/50 to-card p-6 border border-primary/10 shadow-sm">
          <h1 className="text-3xl font-bold mb-3">Popular Actors</h1>
          <p className="text-muted-foreground mb-6">Discover talented actors and explore their filmography</p>
          <ActorSearch />
        </div>
        
        <PopularActorsContent />
      </div>
    </Suspense>
  );
}
