import { useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useAuthStore } from "@/app/store/authStore";
import { User } from "@/app/lib/types";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setIsAuthenticated,
    setIsLoading,
  } = useAuthStore();

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      try {
        setIsLoading(true);
        console.log("Checking session...");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        console.log("Session check result:", !!session);

        if (session?.user) {
          console.log("User authenticated:", session.user.email);
          const userData: User = {
            id: session.user.id,
            email: session.user.email || "",
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || "",
            avatar_url: session.user.user_metadata?.avatar_url,
          };

          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.log("No active session found");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, !!session);

      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || "",
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || "",
          avatar_url: session.user.user_metadata?.avatar_url,
        };

        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setIsAuthenticated, setIsLoading]);

  return { user, isAuthenticated, isLoading };
};

export const useLogin = () => {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw new Error(error.message);
      }

      console.log("Login successful:", !!data.session);

      // Manually update auth state to ensure it's set immediately
      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || "",
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || "",
          avatar_url: data.user.user_metadata?.avatar_url,
        };

        setUser(userData);
        setIsAuthenticated(true);
      }

      return data;
    },
    onSuccess: () => {
      router.push("/");
    },
  });
};

export const useOAuthLogin = () => {
  return useMutation({
    mutationFn: async ({ provider }: { provider: "google" | "github" }) => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          queryParams:
            provider === "google"
              ? {
                  access_type: "offline",
                  prompt: "consent",
                }
              : undefined,
        },
      });

      if (error) {
        console.error(`${provider} OAuth error:`, error.message);
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.user && !data.user.email_confirmed_at) {
        router.push("/auth/verification-sent");
      } else {
        router.push("/");
      }
    },
  });
};

export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout);
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      return null;
    },
    onSuccess: () => {
      logoutStore();
      router.push("/auth/login");
    },
  });
};

export const useIsAuthenticated = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  return { isAuthenticated, isLoading };
};

// Helper function to get user profile after OAuth login
export const useGetUserProfile = () => {
  const { setUser, setIsAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw new Error(error.message);
      }

      if (user) {
        const userData: User = {
          id: user.id,
          email: user.email || "",
          created_at: user.created_at,
          updated_at: user.updated_at || "",
          avatar_url: user.user_metadata?.avatar_url,
        };

        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      }

      return null;
    },
    enabled: false, // Don't run automatically
  });
};

export const useGetProfile = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!user,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    },
  });
};

export const useUpdatePassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    },
    onSuccess: () => {
      router.push("/auth/login?message=Password updated successfully");
    },
  });
};
