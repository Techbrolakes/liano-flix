"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { SpinnerIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { UserReviewsList } from "@/components/profile/UserReviewsList";

export default function ReviewsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <SpinnerIcon className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Button>
        <h1 className="text-3xl font-bold">Your Reviews</h1>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <UserReviewsList />
      </div>
    </div>
  );
}
