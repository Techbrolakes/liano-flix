"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLogin } from "@/app/hooks/useAuth";
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
  AppleIcon,
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

// Use placeholder SVG as backdrop
const BACKDROP_IMAGE = "/images/placeholder.svg";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const { mutate: login, isPending } = useLogin();
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
    <div className="h-[93vh] flex flex-col md:flex-row">
      {/* Left side - Cinematic backdrop */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
          <Image
            src={BACKDROP_IMAGE}
            alt="Movie backdrop"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-12">
          <div className="text-center">
            <h1 className="font-satoshi text-5xl font-black text-white mb-4 drop-shadow-lg">
              <span className="text-red-500">Liano</span>Flix
            </h1>
            <p className="text-xl text-white/90 max-w-md font-medium drop-shadow-md">
              Discover and explore the world of cinema with our curated
              collection of movies and shows.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-black/95">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-8">
            <h1 className="font-satoshi text-4xl font-black mb-2">
              <span className="text-red-500">Liano</span>Flix
            </h1>
          </div>

          <div className="backdrop-blur-sm bg-black/40 p-8 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,0,0,0.15)]">
            <h2 className="text-2xl font-bold mb-6 text-white">Welcome Back</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
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
                            type="email"
                            className="pl-10 bg-neutral-800/50 border-neutral-700 focus:border-red-500/50 focus:ring-red-500/20 text-white"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
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
                          className="text-xs text-red-500 hover:text-red-400 transition-colors"
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
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20"
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
                className="bg-transparent border border-neutral-800 hover:bg-neutral-800/50 text-white"
              >
                <GoogleIcon className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border border-neutral-800 hover:bg-neutral-800/50 text-white"
              >
                <AppleIcon className="mr-2 h-4 w-4" /> Apple
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-neutral-400 text-sm">
                New to LianoFlix?{" "}
                <Link
                  href="/auth/signup"
                  className="text-red-500 hover:text-red-400 font-medium transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
