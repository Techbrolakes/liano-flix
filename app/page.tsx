import { Suspense } from "react";
import { HeroSection } from "./components/HeroSection";
import { MovieRow } from "./components/MovieRow";
import { moviesAPI } from "./lib/api";

async function getMovies() {
  try {
    // Fetch different movie categories
    const [trendingData, popularData, topRatedData, upcomingData] =
      await Promise.all([
        moviesAPI.getTrending("week"),
        moviesAPI.getPopular(),
        moviesAPI.getTopRated(),
        moviesAPI.getUpcoming(),
      ]);

    return {
      trending: trendingData.results,
      popular: popularData.results,
      topRated: topRatedData.results,
      upcoming: upcomingData.results,
      featuredMovie: trendingData.results[0], // Use the first trending movie as featured
    };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return {
      trending: [],
      popular: [],
      topRated: [],
      upcoming: [],
      featuredMovie: null,
    };
  }
}

async function TrendingMoviesRow() {
  const { trending } = await getMovies();
  return (
    <MovieRow
      title="Trending Now"
      movies={trending}
      viewAllHref="/movies/trending"
    />
  );
}

async function PopularMoviesRow() {
  const { popular } = await getMovies();
  return (
    <MovieRow
      title="Popular Movies"
      movies={popular}
      viewAllHref="/movies/popular"
    />
  );
}

async function TopRatedMoviesRow() {
  const { topRated } = await getMovies();
  return (
    <MovieRow
      title="Top Rated"
      movies={topRated}
      viewAllHref="/movies/top-rated"
    />
  );
}

async function UpcomingMoviesRow() {
  const { upcoming } = await getMovies();
  return (
    <MovieRow
      title="Coming Soon"
      movies={upcoming}
      viewAllHref="/movies/upcoming"
    />
  );
}

async function FeaturedMovie() {
  const { featuredMovie } = await getMovies();

  if (!featuredMovie) {
    return null;
  }

  return <HeroSection movie={featuredMovie} />;
}

export default function Home() {
  return (
    <div className="pb-6 pt-16">
      {/* Hero Section with Featured Movie */}
      <Suspense
        fallback={
          <div className="w-full h-[75vh] bg-neutral-900 animate-pulse" />
        }
      >
        <FeaturedMovie />
      </Suspense>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Movie Rows */}
        <Suspense fallback={<MovieRowSkeleton title="Trending Now" />}>
          <TrendingMoviesRow />
        </Suspense>

        <Suspense fallback={<MovieRowSkeleton title="Popular Movies" />}>
          <PopularMoviesRow />
        </Suspense>

        <Suspense fallback={<MovieRowSkeleton title="Top Rated" />}>
          <TopRatedMoviesRow />
        </Suspense>

        <Suspense fallback={<MovieRowSkeleton title="Coming Soon" />}>
          <UpcomingMoviesRow />
        </Suspense>
      </div>
    </div>
  );
}

// Skeleton loader for movie rows
function MovieRowSkeleton({ title }: { title: string }) {
  return (
    <div className="py-4">
      <h2 className="text-xl font-medium text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-full aspect-[2/3] rounded-md bg-neutral-800 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
