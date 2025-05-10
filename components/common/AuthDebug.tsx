"use client";

import { useAuthStore } from "@/app/store/authStore";
import { useEffect, useState } from "react";

export default function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs overflow-auto max-h-60">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <p>Loading: {isLoading ? "true" : "false"}</p>
      <p>Authenticated: {isAuthenticated ? "true" : "false"}</p>
      <p>User: {user ? user.email : "none"}</p>
      {user && (
        <div className="mt-2">
          <p>User ID: {user.id}</p>
          <p>Created: {new Date(user.created_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
