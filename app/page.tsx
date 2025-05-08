import { Suspense } from "react";
import { HeroSection } from "./components/HeroSection";
import { MovieCarousel } from "./components/MovieCarousel";
import { moviesAPI } from "./lib/api";
import { HeroSkeleton } from "./components/skeletons/HeroSkeleton";
import { CarouselSkeleton } from "./components/skeletons/CarouselSkeleton";

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
        fallback={<HeroSkeleton />}
      >
        <FeaturedMovie />
      </Suspense>

      {/* Movie Carousels - Adaptive positioning with smaller negative margin on mobile */}
      <div className="relative z-10 -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
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
    </div>
  );
}


