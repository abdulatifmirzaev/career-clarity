'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
  Mail,
  User,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  yearsExp: z.number().min(0, 'Experience cannot be negative').max(50, 'Invalid years'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Step state: 1 = Registration Details, 2 = 6-Digit OTP Verification
  const [step, setStep] = React.useState<1 | 2>(1);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [resendCooldown, setResendCooldown] = React.useState(0);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      yearsExp: 2,
    },
  });

  // Countdown timer for code resend
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Step 1: Request OTP Verification Code
  const handleRequestCode = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await apiClient<{ message: string; email: string }>('/auth/send-verification', {
        method: 'POST',
        body: { email: values.email },
      });

      setStep(2);
      setResendCooldown(45);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : 'Failed to send verification code. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP Code
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setServerError(null);
    try {
      const email = form.getValues('email');
      await apiClient<{ message: string }>('/auth/send-verification', {
        method: 'POST',
        body: { email },
      });
      setResendCooldown(45);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Could not resend verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and Register Account
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.trim().length < 6) {
      setServerError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      const values = form.getValues();
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
      }>('/auth/register', {
        method: 'POST',
        body: {
          ...values,
          verificationCode: verificationCode.trim(),
        },
      });

      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push('/onboarding');
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : 'Registration failed. Please verify your OTP code.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background/95 to-background/60 selection:bg-cyan-500 selection:text-white">
      <Card className="w-full max-w-md border-border/60 bg-card/70 backdrop-blur-2xl shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg shadow-sm">
            {step === 1 ? 'CC' : <ShieldCheck className="h-6 w-6" />}
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            {step === 1 ? 'Create Your Account' : 'Verify Your Email'}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            {step === 1
              ? 'Start your AI-era engineering leveling and career benchmark diagnostic.'
              : `We sent a 6-digit security code to ${form.getValues('email')}.`}
          </CardDescription>
        </CardHeader>

        {serverError && (
          <div className="mx-6 mb-3 p-3 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs leading-relaxed animate-in fade-in-50">
            {serverError}
          </div>
        )}

        {/* STEP 1: Account Creation Form */}
        {step === 1 && (
          <form onSubmit={form.handleSubmit(handleRequestCode)}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Alex Chen"
                    className="pl-9"
                    disabled={isLoading}
                    {...form.register('name')}
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="alex@company.com"
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
                <Label htmlFor="password">Password (min 8 characters)</Label>
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
                  <p className="text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="yearsExp">Years of Professional Experience</Label>
                <Input
                  id="yearsExp"
                  type="number"
                  min="0"
                  max="40"
                  disabled={isLoading}
                  {...form.register('yearsExp', { valueAsNumber: true })}
                />
                {form.formState.errors.yearsExp && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.yearsExp.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button type="submit" className="w-full min-h-[44px]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Security Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </form>
        )}

        {/* STEP 2: 6-Digit OTP Verification Screen */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister}>
            <CardContent className="space-y-5">
              {/* Email Sent Notice */}
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 text-xs flex items-center gap-2.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="leading-relaxed">
                  A 6-digit passcode has been sent to <strong>{form.getValues('email')}</strong>.
                  Please check your inbox or spam folder.
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <Label
                  htmlFor="otp"
                  className="text-xs font-semibold text-center block text-slate-300 uppercase tracking-wider"
                >
                  Enter 6-Digit OTP Code
                </Label>
                <div className="flex justify-center">
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    autoFocus
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-52 text-center text-3xl tracking-[0.45em] font-mono font-bold py-4 bg-background/90 border-border/80 rounded-xl shadow-inner focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <p className="text-[11px] text-center text-muted-foreground">
                  The security passcode is valid for 10 minutes.
                </p>
              </div>

              {/* Resend button with countdown */}
              <div className="flex items-center justify-center pt-1">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {resendCooldown > 0
                    ? `Resend Code in 00:${resendCooldown < 10 ? `0${resendCooldown}` : resendCooldown}`
                    : 'Resend Passcode'}
                </button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button type="submit" className="w-full min-h-[44px]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Complete Registration</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setServerError(null);
                }}
                className="text-xs text-center text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 py-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Edit Account Details</span>
              </button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
