"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResetPassword } from "@/app/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailIcon, SpinnerIcon } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setError(null);

    resetPassword(
      { email: data.email },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: (err) => {
          setError(
            err.message || "Failed to send reset email. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="h-[93vh] flex items-center justify-center bg-black/95">
      <div className="w-full max-w-md p-8 backdrop-blur-sm bg-black/40 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,0,0,0.15)]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">Reset Password</h2>
          <p className="text-neutral-400 text-sm mb-6">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        {success ? (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-6 rounded-lg mb-6 text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="mb-4">
              Password reset link sent! Check your email inbox.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:from-purple-500 hover:via-violet-500 hover:to-pink-400 text-white w-full"
            >
              <Link href="/auth/login">Return to Login</Link>
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-purple-500 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 text-sm font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <EmailIcon width="16" height="16" />
                          </div>
                          <Input
                            placeholder="Enter your email"
                            className="pl-10 bg-neutral-800/50 border-neutral-700 focus:border-red-500/50 focus:ring-red-500/20 text-white"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-purple-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:from-purple-500 hover:via-violet-500 hover:to-pink-400 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Sending Reset Link...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <div className="text-center mt-4">
                  <p className="text-neutral-400 text-sm">
                    Remember your password?{" "}
                    <Link
                      href="/auth/login"
                      className="text-purple-500 hover:text-red-400 font-medium transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  );
}
