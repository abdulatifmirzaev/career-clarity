'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2, Lock, Mail, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const data = await apiClient<{
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          name: string | null;
          yearsExp: number | null;
          primaryStack: string | null;
          createdAt: string;
        };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push('/dashboard');
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : 'Invalid credentials. Please verify and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = () => {
    form.setValue('email', 'alex.chen@careerclarity.dev');
    form.setValue('password', 'demo12345');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background/95 to-background/60">
      <Card className="w-full max-w-md border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-base shadow-sm">
            CC
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to access your Career Clarity benchmarks & skill roadmaps.
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {serverError && (
              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs leading-relaxed animate-in fade-in-50">
                {serverError}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="engineer@company.com"
                  className="pl-9"
                  disabled={isLoading}
                  {...form.register('email')}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  disabled={isLoading}
                  {...form.register('password')}
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Demo Quick Fill Button */}
            <button
              type="button"
              onClick={fillDemoAccount}
              className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 py-1.5 rounded border border-dashed border-border/70 hover:border-border transition-colors min-h-[36px]"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Fill Seeded Demo Account (Alex Chen)</span>
            </button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" className="w-full min-h-[44px]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Don&apos;t have an account yet?{' '}
              <Link
                href="/auth/register"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Create Account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
