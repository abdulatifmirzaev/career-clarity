'use client';

import React from 'react';
import { AlertTriangle, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function SignOutModal({ isOpen, onClose, onConfirm, isLoading = false }: SignOutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-card border border-border/80 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Oturumu Kapatmak İstiyor Musunuz?
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Mevcut cihazdaki aktif oturumunuz sonlandırılacaktır.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Kayıtlı ilerlemeleriniz, tamamladığınız değerlendirmeler ve mülakat notlarınız güvenle
          saklanmaya devam eder.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs min-h-[38px]"
          >
            Vazgeç
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="text-xs min-h-[38px] flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Evet, Çıkış Yap</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
