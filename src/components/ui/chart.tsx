"use client";

import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export interface ChartContainerProps {
  children: React.ReactNode;
  config: ChartConfig;
  className?: ClassValue;
}

export function ChartContainer({
  children,
  config,
  className,
}: ChartContainerProps) {
  return (
    <div
      className={cn("w-full", className)}
      style={
        {
          "--color-value": config.value?.color,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

export interface ChartTooltipProps {
  children: React.ReactNode;
  className?: ClassValue;
}

export function ChartTooltip({ children, className }: ChartTooltipProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-2 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  hideLabel?: boolean;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
}: ChartTooltipContentProps) {
  if (!active || !payload) {
    return null;
  }

  return (
    <ChartTooltip>
      {!hideLabel && <div className="mb-2 text-sm font-medium">{label}</div>}
      {payload.map((item: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm font-medium">{item.name}:</span>
          <span className="text-sm text-muted-foreground">{item.value}</span>
        </div>
      ))}
    </ChartTooltip>
  );
} 