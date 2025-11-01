"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm",
      "p-6 md:p-8",
      "transition-all duration-300",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-0", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export interface GlowCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ title, description, icon: Icon, className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        className={cn(
          "card-glass relative overflow-hidden group",
          className
        )}
        {...(props as any)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-accent))] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-300" />
        <div className="relative z-10 flex flex-col gap-3">
          {(title || Icon) && (
            <div className="flex items-center gap-2">
              {Icon && (
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-[hsl(var(--color-primary))]/20 to-[hsl(var(--color-accent))]/20 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
              )}
              {title && (
                <h3 className="text-lg font-semibold tracking-tight text-card-foreground">{title}</h3>
              )}
            </div>
          )}
          {description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          )}
          {children}
        </div>
      </motion.div>
    );
  }
);
GlowCard.displayName = "GlowCard";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, GlowCard };
