import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps<T extends React.ElementType = 'button'> {
    as?: T;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button = <T extends React.ElementType = 'button'>({
    as,
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: ButtonProps<T> & React.ComponentPropsWithoutRef<T>) => {
    const Component = as || 'button';

    const variants = {
        primary: 'bg-primary text-primary-foreground shadow-lg hover:shadow-primary/30',
        secondary: 'bg-secondary text-secondary-foreground shadow-lg hover:shadow-secondary/30',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm font-bold',
        lg: 'px-8 py-4 text-lg font-bold'
    };

    return (
        <Component
            className={cn(
                'inline-flex items-center justify-center rounded-xl transition-all duration-300 active:scale-[0.98] btn-premium',
                variants[variant],
                sizes[size],
                className
            )}
            {...(props as any)}
        >
            {children}
        </Component>
    );
};
