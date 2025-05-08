'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/app/store/uiStore';
import { useQuery } from '@tanstack/react-query';
import { genresAPI } from '@/app/lib/api';

export const Sidebar = () => {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  
  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: () => genresAPI.getMovieGenres(),
    staleTime: Infinity, // Genres don't change often
  });
  
  const genres = genresData?.genres || [];
  
  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-neutral-900 transition-transform duration-300 ease-in-out transform pt-20
          lg:relative lg:translate-x-0 lg:z-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 overflow-y-auto h-full">
          <div className="space-y-6">
            <div>
              <h3 className="text-neutral-400 uppercase text-xs font-medium tracking-wider mb-2">
                Browse
              </h3>
              <ul className="space-y-1">
                <SidebarItem
                  href="/"
                  label="Home"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  }
                  active={pathname === '/'}
                />
                <SidebarItem
                  href="/movies/popular"
                  label="Popular"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                    </svg>
                  }
                  active={pathname === '/movies/popular'}
                />
                <SidebarItem
                  href="/movies/trending"
                  label="Trending"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                  }
                  active={pathname === '/movies/trending'}
                />
                <SidebarItem
                  href="/movies/top-rated"
                  label="Top Rated"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  }
                  active={pathname === '/movies/top-rated'}
                />
                <SidebarItem
                  href="/movies/upcoming"
                  label="Upcoming"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  }
                  active={pathname === '/movies/upcoming'}
                />
                <SidebarItem
                  href="/actors/popular"
                  label="Popular Actors"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  }
                  active={pathname === '/actors/popular'}
                />
              </ul>
            </div>
            
            {genres.length > 0 && (
              <div>
                <h3 className="text-neutral-400 uppercase text-xs font-medium tracking-wider mb-2">
                  Genres
                </h3>
                <ul className="space-y-1">
                  {genres.map((genre) => (
                    <SidebarItem
                      key={genre.id}
                      href={`/movies/genre/${genre.id}`}
                      label={genre.name}
                      active={pathname === `/movies/genre/${genre.id}`}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

type SidebarItemProps = {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active: boolean;
};

const SidebarItem = ({ href, label, icon, active }: SidebarItemProps) => {
  return (
    <li>
      <Link
        href={href}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-md transition-colors
          ${active ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}
        `}
      >
        {icon && <span className="text-neutral-400">{icon}</span>}
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </li>
  );
};
