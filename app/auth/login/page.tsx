'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/app/hooks/useAuth';
import { useAuthStore } from '@/app/store/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/app/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const { mutate: login, isPending } = useLogin();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  // Setup react-hook-form with zod validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/');
    return null;
  }
  
  const onSubmit = (data: LoginFormData) => {
    setError(null);
    
    login(
      { email: data.email, password: data.password },
      {
        onError: (err) => {
          setError(err.message || 'Failed to login. Please try again.');
        },
      },
    );
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-2xl border border-border">
        <div className="text-center mb-8">
          <h1 className="text-primary text-3xl font-bold mb-2">LianoFlix</h1>
          <h2 className="text-foreground text-xl font-medium">Sign In</h2>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email"
                      type="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your password"
                      type="password"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <div className="text-center mt-6">
              <p className="text-muted-foreground text-sm">
                New to LianoFlix?{' '}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Sign up now
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
