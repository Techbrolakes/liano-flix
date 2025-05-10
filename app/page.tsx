import { Suspense } from "react";
import { moviesAPI } from "./lib/api";
import { HeroSkeleton } from "../components/skeletons/HeroSkeleton";
import { CarouselSkeleton } from "../components/skeletons/CarouselSkeleton";
import { MovieCarousel } from "@/components/movies";
import { HeroCarousel } from "@/components/common/HeroCarousel";

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

    // Select a diverse set of popular genres (12 genres instead of 5)
    // These are some of the most popular genres on TMDB
    const popularGenreIds = [
      28, // Action
      12, // Adventure
      16, // Animation
      35, // Comedy
      80, // Crime
      18, // Drama
      14, // Fantasy
      27, // Horror
      10749, // Romance
      878, // Science Fiction
      53, // Thriller
      10752, // War
    ];

    // Filter genres to include only the popular ones and ensure they exist in the API response
    const selectedGenres = genresData.genres
      .filter((genre) => popularGenreIds.includes(genre.id))
      // Sort them in the same order as popularGenreIds
      .sort((a, b) => {
        return popularGenreIds.indexOf(a.id) - popularGenreIds.indexOf(b.id);
      });

    // Get movies for different genres
    const genrePromises = selectedGenres.map(async (genre) => {
      const data = await moviesAPI.getMoviesByGenre(genre.id);
      return {
        id: genre.id,
        name: genre.name,
        movies: data.results,
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
  const { trending } = await getMovies();

  if (!trending || trending.length === 0) {
    return null;
  }

  return <HeroCarousel movies={trending} />;
}

export default function Home() {
  return (
    <div className="pb-6">
      {/* Hero Section with Featured Movie */}
      <Suspense fallback={<HeroSkeleton />}>
        <FeaturedMovie />
      </Suspense>

      {/* Movie Carousels - Adaptive positioning with smaller negative margin on mobile */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-screen-3xl mx-auto">
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
