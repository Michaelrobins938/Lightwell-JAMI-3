/**
 * Utility for combining class names
 * Similar to clsx/classnames but lightweight
 */

export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}