"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin, useOAuthLogin } from "@/app/hooks/useAuth";
import { useAuthStore } from "@/app/store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/app/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  EmailIcon,
  LockIcon,
  GoogleIcon,
  GitHubIcon,
  SpinnerIcon,
} from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const { mutate: login, isPending } = useLogin();
  const { mutate: oauthLogin, isPending: isOAuthPending } = useOAuthLogin();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Setup react-hook-form with zod validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const onSubmit = (data: LoginFormData) => {
    setError(null);

    login(
      { email: data.email, password: data.password },
      {
        onError: (err) => {
          setError(err.message || "Failed to login. Please try again.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-background" />

      {/* Vibrant gradient mesh matching navbar theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/60 via-background to-neutral-800/40" />
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-primary/3" />

      {/* Large animated gradient orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 to-primary/8 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
      <div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-primary/12 to-primary/6 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-muted/30 to-primary/8 rounded-full mix-blend-screen filter blur-[90px] animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Floating accent orbs */}
      <div
        className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full filter blur-2xl animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute bottom-40 left-40 w-40 h-40 bg-primary/15 rounded-full filter blur-2xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Radial gradient spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-neutral-900/50 p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-neutral-400 text-sm">
              Sign in to continue your journey
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-purple-500 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                          type="email"
                          className="pl-10 bg-neutral-800/50 border-neutral-700 focus:border-red-500/50 focus:ring-red-500/20 text-white"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-purple-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-white/80 text-sm font-medium">
                        Password
                      </FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-purple-500 hover:text-red-400 transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                          <LockIcon width="16" height="16" />
                        </div>
                        <Input
                          placeholder="Enter your password"
                          type="password"
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
                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:from-purple-500 hover:via-violet-500 hover:to-pink-400 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20"
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black/40 px-2 text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              variant="outline"
              className="bg-transparent cursor-pointer border border-neutral-800 hover:bg-neutral-800/50 text-white"
              onClick={() => {
                setError(null);
                oauthLogin(
                  { provider: "google" },
                  {
                    onError: (err) => {
                      setError(
                        err.message ||
                          "Failed to login with Google. Please try again."
                      );
                    },
                  }
                );
              }}
              disabled={isOAuthPending}
            >
              <GoogleIcon className="mr-2 h-4 w-4" /> Google
            </Button>
            <Button
              variant="outline"
              className="bg-transparent cursor-pointer border border-neutral-800 hover:bg-neutral-800/50 text-white"
              onClick={() => {
                setError(null);
                oauthLogin(
                  { provider: "github" },
                  {
                    onError: (err) => {
                      setError(
                        err.message ||
                          "Failed to login with GitHub. Please try again."
                      );
                    },
                  }
                );
              }}
              disabled={isOAuthPending}
            >
              <GitHubIcon className="mr-2 h-4 w-4" /> GitHub
            </Button>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-neutral-800">
            <p className="text-neutral-400 text-sm">
              New to OlaMax?{" "}
              <Link
                href="/auth/signup"
                className="text-purple-500 hover:text-purple-400 font-medium transition-colors cursor-pointer"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
