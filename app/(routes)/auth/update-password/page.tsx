"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdatePassword } from "@/app/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockIcon, SpinnerIcon } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Validation schema
const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const { mutate: updatePassword, isPending } = useUpdatePassword();

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: UpdatePasswordFormData) => {
    setError(null);

    updatePassword(
      { password: data.password },
      {
        onError: (err) => {
          setError(
            err.message || "Failed to update password. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="h-[93vh] flex items-center justify-center bg-black/95">
      <div className="w-full max-w-md p-8 backdrop-blur-sm bg-black/40 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,0,0,0.15)]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">
            Update Password
          </h2>
          <p className="text-neutral-400 text-sm mb-6">
            Create a new password for your account.
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 text-sm font-medium">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <LockIcon width="16" height="16" />
                      </div>
                      <Input
                        placeholder="Create a new password"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 text-sm font-medium">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <LockIcon width="16" height="16" />
                      </div>
                      <Input
                        placeholder="Confirm your password"
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
              className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-pink-500 hover:from-purple-500 hover:via-violet-500 hover:to-pink-400 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20"
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Updating Password...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
