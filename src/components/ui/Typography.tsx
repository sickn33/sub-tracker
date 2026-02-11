import React, { useMemo } from 'react';

type DisplayVariant = 'giant' | 'large' | 'medium';
type BodyVariant = 'lead' | 'regular' | 'small' | 'caption';
type MonoVariant = 'code' | 'label';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  className?: string;
}

export const Display: React.FC<TypographyProps & { variant?: DisplayVariant }> = ({
  as: Component = 'h1',
  variant = 'large',
  className = '',
  children,
  ...props
}) => {
  const styles = useMemo(() => {
    switch (variant) {
      case 'giant': return 'font-display text-6xl md:text-8xl font-bold tracking-tighter leading-none';
      case 'large': return 'font-display text-4xl md:text-6xl font-semibold tracking-tight';
      case 'medium': return 'font-display text-2xl md:text-3xl font-medium tracking-tight';
    }
  }, [variant]);

  return <Component className={`${styles} ${className}`} {...props}>{children}</Component>;
};

export const Body: React.FC<TypographyProps & { variant?: BodyVariant }> = ({
  as: Component = 'p',
  variant = 'regular',
  className = '',
  children,
  ...props
}) => {
  const styles = useMemo(() => {
    switch (variant) {
      case 'lead': return 'font-body text-xl md:text-2xl font-light leading-relaxed text-ink/90';
      case 'regular': return 'font-body text-base leading-relaxed text-ink/80';
      case 'small': return 'font-body text-sm leading-normal text-ink/60';
      case 'caption': return 'font-body text-xs uppercase tracking-widest font-medium text-ink/40';
    }
  }, [variant]);

  return <Component className={`${styles} ${className}`} {...props}>{children}</Component>;
};

export const Mono: React.FC<TypographyProps & { variant?: MonoVariant }> = ({
  as: Component = 'span',
  variant = 'code',
  className = '',
  children,
  ...props
}) => {
   const styles = useMemo(() => {
    switch (variant) {
      case 'code': return 'font-mono text-sm bg-concrete px-1 py-0.5 rounded text-ink';
      case 'label': return 'font-mono text-xs uppercase tracking-wider text-ink/50 border border-structural px-2 py-0.5 rounded-full';
    }
  }, [variant]);

  return <Component className={`${styles} ${className}`} {...props}>{children}</Component>;
};
