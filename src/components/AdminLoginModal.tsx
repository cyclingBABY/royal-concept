import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { adminLogin } from '../data/adminStore';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [accessCode, setAccessCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const success = adminLogin(accessCode);
      setIsLoading(false);
      if (success) {
        setAccessCode('');
        onLoginSuccess();
      } else {
        setErrorMsg('Invalid access code. Please verify credentials or enter "code5@royal".');
      }
    }, 250);
  };

  const handleQuickFill = () => {
    setAccessCode('code5@royal');
    setErrorMsg('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
    >
      <div className="relative w-full max-w-md bg-[#111111] border border-[#252525] rounded-3xl shadow-2xl overflow-hidden text-neutral-100">
        
        {/* Subtle accent line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF2E00] via-[#00F0FF] to-[#FF2E00]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#2A2A2A] text-neutral-400 hover:text-white transition border border-[#2B2B2B]"
          aria-label="Close login dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FF2E00]/10 border border-[#FF2E00]/20 text-[#FF2E00] text-[11px] font-mono font-bold tracking-wider uppercase">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Staff Access • code5@royal</span>
            </div>
            
            <h2 id="admin-login-title" className="text-2xl font-black text-white tracking-tight">
              Royal Concepts Admin
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Enter your master authorization passcode to manage event bookings, equipment fleet inventory, and quotation requests.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-code-input" className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                <span>Passcode / Authorization Key</span>
                <span className="text-[10px] text-[#00F0FF] font-mono">CODE: code5@royal</span>
              </label>
              
              <div className="relative">
                <input
                  id="admin-code-input"
                  type="text"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter 'code5@royal'..."
                  autoFocus
                  required
                  className="w-full bg-[#0A0A0A] border border-[#2B2B2B] focus:border-[#FF2E00] focus:ring-1 focus:ring-[#FF2E00] rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-neutral-600 transition outline-none pr-10"
                />
                <KeyRound className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-red-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FF2E00] shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Demo Helper */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#161616] border border-[#222222] text-xs">
              <span className="text-neutral-400 text-[11px]">Passcode preset:</span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="font-mono font-bold text-[#00F0FF] hover:text-cyan-300 transition text-[11px] underline flex items-center gap-1"
              >
                <span>Click to auto-fill "code5@royal"</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF2E00] to-[#E02900] hover:from-[#E02900] hover:to-[#C02200] text-white font-bold text-sm tracking-wide transition shadow-lg shadow-[#FF2E00]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Launch Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between text-[10px] font-mono text-neutral-500">
            <span>TERMINAL CODE: CODE5@ROYAL</span>
            <span className="text-neutral-400">STAGE RIGGING AV OPS</span>
          </div>

        </div>
      </div>
    </div>
  );
};
