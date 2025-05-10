"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/app/lib/supabase";
import { useAuthStore } from "@/app/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpinnerIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserReviewsList } from "@/components/profile/UserReviewsList";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Validation schema
const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      fullName: "",
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (data) {
          setProfileData(data);
          setAvatarUrl(data.avatar_url);

          form.reset({
            username: data.username || "",
            fullName: data.full_name || "",
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProfile();
  }, [user, form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setError(null);
    setSuccess(null);
    setIsUpdating(true);

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: data.username,
        full_name: data.fullName,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Profile updated successfully");
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while updating your profile"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!user || !event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;

    setError(null);
    setUploadingAvatar(true);

    try {
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase.from("profiles").upsert({
        id: user.id,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(avatarUrl);
      setSuccess("Avatar updated successfully");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Error uploading avatar"
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <SpinnerIcon className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="container shadow-2xl mx-auto py-12 px-4">
      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/30 flex items-center gap-2 pr-4 pl-3 h-9"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {uploadingAvatar ? (
                  <div className="h-32 w-32 rounded-full bg-neutral-800 flex items-center justify-center">
                    <SpinnerIcon className="animate-spin h-8 w-8 text-primary" />
                  </div>
                ) : (
                  <Avatar className="h-32 w-32 border-4 border-primary/20">
                    <AvatarImage
                      src={avatarUrl || undefined}
                      alt={user?.email || "User"}
                    />
                    <AvatarFallback className="text-2xl bg-neutral-800 text-primary">
                      {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <h2 className="text-xl font-bold mb-1">
                {profileData?.username || user?.email?.split("@")[0]}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                {user?.email}
              </p>

              <div className="w-full border-t border-border my-4"></div>

              <div className="w-full">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Member since</span>
                  <span>
                    {new Date(user?.created_at || "").toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile" className="text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                Profile
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-0">
              <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="text-xl font-bold mb-6">Edit Profile</h2>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 rounded-lg mb-6 text-sm">
                    {success}
                  </div>
                )}

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your username"
                              className="bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              className="bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full sm:w-auto"
                    >
                      {isUpdating ? (
                        <span className="flex items-center">
                          <SpinnerIcon className="animate-spin mr-2 h-4 w-4" />
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Recent Reviews</h2>
                  <Button asChild>
                    <Link href="/reviews" className="flex items-center gap-2">
                      <span>View All Reviews</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>
                  </Button>
                </div>
                <UserReviewsList limit={3} showViewAllLink={true} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
