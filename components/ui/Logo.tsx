'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <h1 className={`logo font-bold ${sizeClasses[size]} ${className}`}>
      <span className="text-white">[</span>
      <span className="text-white">Predicted</span>
      <span className="text-white">]</span>
    </h1>
  );
}

export function LogoWithAccent({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <h1 className={`logo font-bold ${sizeClasses[size]} ${className}`}>
      <span className="text-accent-500">[</span>
      <span className="text-white">Predicted</span>
      <span className="text-accent-500">]</span>
    </h1>
  );
}
