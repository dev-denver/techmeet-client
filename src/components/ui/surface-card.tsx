import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const surfaceCardVariants = cva("rounded-xl border bg-card overflow-hidden", {
  variants: {
    padding: {
      md: "px-4 pt-4 pb-4",
      compact: "px-3.5 pt-3.5 pb-3.5",
      none: "",
    },
  },
  defaultVariants: {
    padding: "md",
  },
});

export interface SurfaceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceCardVariants> {}

export function SurfaceCard({ className, padding, ...props }: SurfaceCardProps) {
  return <div className={cn(surfaceCardVariants({ padding }), className)} {...props} />;
}
