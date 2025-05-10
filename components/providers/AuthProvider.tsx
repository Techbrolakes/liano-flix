"use client";

import { ReactNode } from "react";
import { useAuth } from "@/app/hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize auth state
  useAuth();

  // We don't need to render anything special, just initialize the auth hook
  return <>{children}</>;
}
