"use client";

import { useSearchParams } from "next/navigation";
import { ActorCatalogue } from "@/app/components/ActorCatalogue";
import { ActorSearch } from "@/app/components/ActorSearch";
import { usePopularActors, useSearchActors } from "@/app/hooks/useActorQueries";

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

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Popular Actors</h1>
      <ActorSearch />
      <PopularActorsContent />
    </div>
  );
}

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
