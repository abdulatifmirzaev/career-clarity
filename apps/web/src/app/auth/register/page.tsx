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
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Lütfen geçerli bir e-posta adresi girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter uzunluğunda olmalıdır'),
  yearsExp: z.number().min(0, 'Negatif olamaz').max(50, 'Geçersiz deneyim yılı'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Step state: 1 = Form, 2 = Verification OTP
  const [step, setStep] = React.useState<1 | 2>(1);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [previewCode, setPreviewCode] = React.useState<string | null>(null);
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

  // Countdown timer for resend code
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Step 1: Send verification code
  const handleRequestCode = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await apiClient<{ message: string; email: string; code?: string }>(
        '/auth/send-verification',
        {
          method: 'POST',
          body: { email: values.email },
        },
      );

      if (res.code) {
        setPreviewCode(res.code);
      }

      setStep(2);
      setResendCooldown(45);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : 'Doğrulama kodu gönderilemedi. Lütfen tekrar deneyin.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setServerError(null);
    try {
      const email = form.getValues('email');
      const res = await apiClient<{ code?: string }>('/auth/send-verification', {
        method: 'POST',
        body: { email },
      });
      if (res.code) setPreviewCode(res.code);
      setResendCooldown(45);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Kod tekrar gönderilemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code and finalize registration
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.trim().length < 6) {
      setServerError('Lütfen 6 haneli doğrulama kodunu eksiksiz girin.');
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
      setServerError(err instanceof Error ? err.message : 'Kayıt tamamlanamadı.');
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
            {step === 1 ? 'Hesabınızı Oluşturun' : 'E-Postanızı Doğrulayın'}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            {step === 1
              ? 'Yapay zeka çağında seviye analizi ve kariyer haritanızı başlatın.'
              : `${form.getValues('email')} adresine 6 haneli güvenlik kodu iletildi.`}
          </CardDescription>
        </CardHeader>

        {serverError && (
          <div className="mx-6 mb-3 p-3 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs leading-relaxed animate-in fade-in-50">
            {serverError}
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={form.handleSubmit(handleRequestCode)}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Ad Soyad</Label>
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
                <Label htmlFor="email">E-posta Adresi</Label>
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
                <Label htmlFor="password">Şifre (en az 8 karakter)</Label>
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
                <Label htmlFor="yearsExp">Profesyonel Deneyim (Yıl)</Label>
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
                    <span>Doğrulama Kodu Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <span>Doğrulama Kodu İste</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Zaten bir hesabınız var mı?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Giriş Yap
                </Link>
              </p>
            </CardFooter>
          </form>
        )}

        {/* STEP 2: Verification Code (OTP) */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister}>
            <CardContent className="space-y-5">
              {/* Dev Simulation Badge */}
              {previewCode && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Güvenlik Doğrulama Kodu:</span>
                  </div>
                  <code className="px-2 py-0.5 rounded bg-cyan-900/60 font-mono font-bold text-sm tracking-wider text-cyan-300 border border-cyan-700/50">
                    {previewCode}
                  </code>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="otp"
                  className="text-xs font-semibold text-center block text-slate-300"
                >
                  6 Haneli Doğrulama Kodunu Girin
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
                    className="w-48 text-center text-2xl tracking-[0.4em] font-mono font-bold py-3 bg-background/80 border-border/80 rounded-xl"
                  />
                </div>
                <p className="text-[11px] text-center text-muted-foreground">
                  Kod 10 dakika boyunca geçerlidir.
                </p>
              </div>

              {/* Resend button with cooldown */}
              <div className="flex items-center justify-center pt-1">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {resendCooldown > 0 ? `Tekrar Gönder (${resendCooldown}s)` : 'Kodu Tekrar Gönder'}
                </button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button type="submit" className="w-full min-h-[44px]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Doğrulanıyor ve Hesap Açılıyor...</span>
                  </>
                ) : (
                  <>
                    <span>Hesabı Doğrula ve Başla</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Bilgileri Düzenle
              </button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
