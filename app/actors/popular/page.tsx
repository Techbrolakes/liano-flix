import { Suspense } from "react";
import { peopleAPI } from "@/app/lib/api";
import { ActorCatalogue } from "@/app/components/ActorCatalogue";
import { ActorSearch } from "@/app/components/ActorSearch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Popular Actors | LianoFlix",
  description: "Browse the most popular actors on LianoFlix",
};

async function PopularActors({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q || "";
  const data = query 
    ? await peopleAPI.searchPeople(query, 1)
    : await peopleAPI.getPopular(1);
  
  return (
    <ActorCatalogue 
      initialActors={data.results}
      searchQuery={query}
    />
  );
}

export default function Page({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Popular Actors</h1>
      <ActorSearch />
      <Suspense fallback={<ActorCatalogueSkeleton />}>
        <PopularActors searchParams={searchParams} />
      </Suspense>
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
