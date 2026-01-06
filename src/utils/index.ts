/**
 * Utility functions
 */

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

