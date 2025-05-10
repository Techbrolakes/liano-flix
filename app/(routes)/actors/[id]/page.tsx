"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ActorInfo } from "@/components/actors/ActorInfo";
import { ActorFilmography } from "@/components/actors/ActorFilmography";
import {
  ActorInfoSkeleton,
  ActorFilmographySkeleton,
} from "@/components/skeletons/ActorDetailsSkeleton";

export default function ActorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [actorId, setActorId] = useState<number | null>(null);

  useEffect(() => {
    const fetchActorId = async () => {
      const id = parseInt((await params).id, 10);
      if (isNaN(id)) {
        router.push("/not-found");
        return;
      }
      setActorId(id);
    };
    fetchActorId();
  }, [params, router]);

  if (!actorId) {
    return (
      <div className="pb-10 pt-24">
        <ActorInfoSkeleton />
        <ActorFilmographySkeleton />
      </div>
    );
  }

  return (
    <div className="pb-10 pt-24">
      <ActorInfo id={actorId} />
      <ActorFilmography id={actorId} />
    </div>
  );
}
