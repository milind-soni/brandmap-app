import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-bold uppercase tracking-wider text-sm border-2 transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_0px_var(--shadow-color)] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "bg-[#1a1a1a] text-[#f0f0e8] border-[#1a1a1a] shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-[#8b4513] hover:border-[#8b4513]",
        primary:
          "bg-[#8b4513] text-[#f0f0e8] border-[#8b4513] shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-[#a0522d] hover:border-[#a0522d]",
        outline:
          "bg-transparent text-[#1a1a1a] border-[#1a1a1a] shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-[#1a1a1a] hover:text-[#f0f0e8]",
        ghost:
          "bg-transparent text-[#1a1a1a] border-transparent shadow-none hover:bg-[#e8e8e0] hover:border-[#1a1a1a]",
        link: "bg-transparent text-[#1a1a1a] border-transparent shadow-none underline underline-offset-4 hover:text-[#8b4513]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
