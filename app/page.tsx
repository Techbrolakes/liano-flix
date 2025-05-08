import { Suspense } from "react";
import { HeroSection } from "./components/HeroSection";
import { MovieCarousel } from "./components/MovieCarousel";
import { moviesAPI } from "./lib/api";

async function getMovies() {
  try {
    // Fetch different movie categories
    const [trendingData, popularData, topRatedData, upcomingData, genresData] =
      await Promise.all([
        moviesAPI.getTrending("week"),
        moviesAPI.getPopular(),
        moviesAPI.getTopRated(),
        moviesAPI.getUpcoming(),
        moviesAPI.getGenres(),
      ]);
    
    // Get movies for different genres
    const genrePromises = genresData.genres.slice(0, 5).map(async (genre) => {
      const data = await moviesAPI.getMoviesByGenre(genre.id);
      return {
        id: genre.id,
        name: genre.name,
        movies: data.results
      };
    });
    
    const genreMovies = await Promise.all(genrePromises);

    return {
      trending: trendingData.results,
      popular: popularData.results,
      topRated: topRatedData.results,
      upcoming: upcomingData.results,
      genres: genresData.genres,
      genreMovies: genreMovies,
      featuredMovie: trendingData.results[0], // Use the first trending movie as featured
    };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return {
      trending: [],
      popular: [],
      topRated: [],
      upcoming: [],
      genres: [],
      genreMovies: [],
      featuredMovie: null,
    };
  }
}

async function TrendingMoviesCarousel() {
  const { trending } = await getMovies();
  return (
    <MovieCarousel
      title="Trending Now"
      movies={trending}
      viewAllHref="/movies/trending"
    />
  );
}

async function PopularMoviesCarousel() {
  const { popular } = await getMovies();
  return (
    <MovieCarousel
      title="Popular Movies"
      movies={popular}
      viewAllHref="/movies/popular"
    />
  );
}

async function TopRatedMoviesCarousel() {
  const { topRated } = await getMovies();
  return (
    <MovieCarousel
      title="Top Rated"
      movies={topRated}
      viewAllHref="/movies/top-rated"
    />
  );
}

async function UpcomingMoviesCarousel() {
  const { upcoming } = await getMovies();
  return (
    <MovieCarousel
      title="Coming Soon"
      movies={upcoming}
      viewAllHref="/movies/upcoming"
    />
  );
}

async function GenreCarousels() {
  const { genreMovies } = await getMovies();
  
  return (
    <>
      {genreMovies.map((genre) => (
        <MovieCarousel
          key={genre.id}
          title={genre.name}
          movies={genre.movies}
          viewAllHref={`/genre/${genre.id}`}
        />
      ))}
    </>
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
    <div className="pb-6">
      {/* Hero Section with Featured Movie */}
      <Suspense
        fallback={
          <div className="w-full h-[75vh] bg-muted animate-pulse" />
        }
      >
        <FeaturedMovie />
      </Suspense>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Movie Carousels */}
        <div className="max-w-screen-2xl mx-auto">
          <Suspense fallback={<CarouselSkeleton />}>
            <TrendingMoviesCarousel />
          </Suspense>

          <Suspense fallback={<CarouselSkeleton />}>
            <PopularMoviesCarousel />
          </Suspense>

          <Suspense fallback={<CarouselSkeleton />}>
            <TopRatedMoviesCarousel />
          </Suspense>

          <Suspense fallback={<CarouselSkeleton />}>
            <UpcomingMoviesCarousel />
          </Suspense>
          
          {/* Genre-specific Carousels */}
          <Suspense fallback={<CarouselSkeleton />}>
            <GenreCarousels />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Skeleton loaders for the movie carousels
const CarouselSkeleton = () => (
  <div className="py-8">
    <div className="h-8 w-48 bg-muted rounded-md mb-4 px-4 md:px-6 lg:px-8 animate-pulse" />
    <div className="flex gap-4 overflow-hidden pl-4 md:pl-6 lg:pl-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-[160px] md:w-[180px] lg:w-[200px] animate-pulse"
        >
          <div className="aspect-[2/3] bg-muted rounded-md mb-2" />
          <div className="h-4 bg-muted rounded mb-1" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
      ))}
    </div>
  </div>
);
