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
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col space-y-6">
        {/* Header with count */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/30 flex items-center gap-2 pr-4 pl-3 h-9"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </Button>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Your Reviews</h1>
              <p className="text-muted-foreground mt-1">Share your thoughts on your favorite movies</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <UserReviewsList />
        </div>
      </div>
    </div>
  );
}
