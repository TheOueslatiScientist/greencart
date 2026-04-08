import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-white hover:bg-green-700 shadow-soft focus-visible:ring-brand-primary",
        secondary:
          "bg-white text-brand-primary border border-brand-primary hover:bg-green-50 focus-visible:ring-brand-primary",
        ghost:
          "text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-300",
        danger:
          "bg-brand-red text-white hover:bg-red-600 focus-visible:ring-brand-red",
        orange:
          "bg-brand-orange text-white hover:bg-yellow-500 focus-visible:ring-brand-orange",
        outline:
          "bg-transparent border border-brand-gray text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-300",
      },
      size: {
        sm: "px-4 py-2 text-sm rounded-lg",
        md: "px-6 py-3 text-sm rounded-xl",
        lg: "px-8 py-4 text-base rounded-xl",
        icon: "p-2.5 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
