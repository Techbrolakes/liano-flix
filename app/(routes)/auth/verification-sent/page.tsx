"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerificationSentPage() {
  return (
    <div className="h-[93vh] flex items-center justify-center bg-black/95">
      <div className="w-full max-w-md p-8 backdrop-blur-sm bg-black/40 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,0,0,0.15)]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Email Verification
          </h2>
        </div>

        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6 mb-6">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 text-purple-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <p className="text-white text-center mb-4">
            We&apos;ve sent a verification email to your inbox. Please check
            your email and click the verification link to activate your account.
          </p>
          <p className="text-neutral-400 text-sm text-center">
            If you don&apos;t see the email, check your spam folder or try
            again.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:from-purple-500 hover:via-violet-500 hover:to-pink-400 text-white"
          >
            <Link href="/auth/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
