"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";

interface TrailerButtonProps {
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
}

export const TrailerButton = ({ videos }: TrailerButtonProps) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");

  // Find the best trailer video
  const trailer =
    videos?.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    ) || videos?.results.find((video) => video.site === "YouTube");

  const handlePlayTrailer = () => {
    if (trailer) {
      setTrailerKey(trailer.key);
      setIsTrailerOpen(true);
    }
  };

  // Don't render if there are no valid trailers
  if (!trailer) return null;

  return (
    <>
      <button
        onClick={handlePlayTrailer}
        className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 hover:bg-primary/90 text-white rounded-md px-4 py-2 font-medium transition"
      >
        <Play size={16} />
        Watch Trailer
      </button>

      <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/80" />
          <DialogContent className="p-0 border-none max-w-8xl w-full aspect-video overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};
