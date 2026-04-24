import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dark?: boolean;
}

const LogoIcon = ({ className }: { className?: string }) => (
  <img 
    src="/logo.png" 
    alt="CodeMind Logo" 
    className={className}
    style={{ transition: 'transform 0.3s ease', objectFit: 'contain' }}
  />
);

export default function Logo({ className = "", showText = true, size = 'md', dark = false }: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-5 h-5', text: 'text-lg' },
    md: { icon: 'w-6 h-6', text: 'text-xl' },
    lg: { icon: 'w-8 h-8', text: 'text-2xl' },
    xl: { icon: 'w-10 h-10', text: 'text-3xl' },
  };

  const currentSize = sizeClasses[size];
  const textColor = dark ? 'text-white' : 'text-foreground';
  const brandColor = dark ? 'text-white/90' : 'text-primary';

  return (
    <Link 
      href="/" 
      className={`group flex items-center gap-2.5 select-none ${className}`}
    >
      <div className="relative">
        {/* Logo Icon with hover effect */}
        <LogoIcon className={`${currentSize.icon} ${textColor} group-hover:scale-110 transition-transform duration-300`} />
      </div>
      
      {showText && (
        <span className={`${currentSize.text} font-mono font-bold tracking-tighter ${textColor}`}>
          Code<span className={brandColor}>Mind</span>
        </span>
      )}
    </Link>
  );
}
