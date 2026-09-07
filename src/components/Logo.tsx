import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: 'full' | 'compact' | 'badge';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showTagline = false,
  variant = 'compact',
  size = 'md',
}) => {
  // Dimension scales
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-sm tracking-tight',
    md: 'text-lg tracking-tight',
    lg: 'text-2xl tracking-tight',
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[11px] tracking-wider',
    lg: 'text-xs tracking-wider',
  };

  // The stylized RC Monogram SVG matching the uploaded brand asset
  const RcEmblem = () => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}
      aria-label="Royal Concepts Emblem"
    >
      {/* Outer circular frame with sleek styling */}
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" className="text-white" />
      
      {/* Dynamic stylized 'R' & 'C' internal geometry */}
      {/* R vertical stem and loop */}
      <path
        d="M 28 26 L 28 74"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        className="text-white"
      />
      <path
        d="M 28 28 H 54 C 64 28 70 34 70 42 C 70 50 63 56 52 56 H 28"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      />
      {/* R dynamic angled leg */}
      <path
        d="M 48 54 L 68 74"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        className="text-white"
      />
      {/* C crescent outer curve accent in bold brand color */}
      <path
        d="M 72 32 C 78 37 82 43 82 50 C 82 66 68 78 52 78"
        stroke="#FF2E00"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div className={`inline-flex flex-col items-center bg-[#141414] border border-[#262626] rounded-2xl p-4 shadow-xl text-white ${className}`}>
        <div className="flex items-center gap-3.5 border border-[#333333] rounded-xl px-5 py-3 bg-[#0D0D0D]">
          <RcEmblem />
          <div className="flex flex-col leading-none font-bold text-left">
            <span className="font-extrabold text-xl tracking-wider text-white">ROYAL</span>
            <span className="font-extrabold text-xl tracking-wider text-white">CONCEPTS</span>
          </div>
        </div>
        <div className="mt-2.5 text-center">
          <p className="text-xs font-semibold text-neutral-300 tracking-wide">
            For: Lights, Truss, Screens, Sound and Boardwork
          </p>
          <p className="text-[11px] font-mono text-[#FF2E00] mt-0.5 tracking-wider">
            0772 615 454 | 0702 615 454 | 0702 838 474
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 text-white ${className}`}>
      <RcEmblem />
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5 font-black uppercase">
          <span className={`${titleSizes[size]} text-white font-extrabold`}>ROYAL</span>
          <span className={`${titleSizes[size]} text-[#FF2E00] font-extrabold`}>CONCEPTS</span>
        </div>
        {showTagline && (
          <span className={`${subtitleSizes[size]} text-neutral-400 font-medium uppercase tracking-widest mt-0.5`}>
            Rigging • Stage • Sound • LED
          </span>
        )}
      </div>
    </div>
  );
};
