/**
 * Countdown service with tamper-resistant logic
 * Ensures countdown integrity and prevents reset exploits
 */

import { Countdown } from '../types';

class CountdownService {
  /**
   * Create a new countdown
   */
  createCountdown(durationDays: number): Countdown {
    const startDate = Date.now();
    const durationMs = durationDays * 24 * 60 * 60 * 1000;
    const endDate = startDate + durationMs;

    return {
      startDate,
      durationDays,
      endDate,
    };
  }

  /**
   * Get remaining days in countdown
   */
  getRemainingDays(countdown: Countdown): number {
    const now = Date.now();
    const remainingMs = countdown.endDate - now;
    
    if (remainingMs <= 0) {
      return 0;
    }

    const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    return remainingDays;
  }

  /**
   * Check if countdown is complete
   */
  isComplete(countdown: Countdown): boolean {
    return Date.now() >= countdown.endDate;
  }

  /**
   * Validate countdown integrity
   * Prevents tampering by ensuring startDate + duration = endDate
   */
  validateIntegrity(countdown: Countdown): boolean {
    const expectedEndDate = countdown.startDate + (countdown.durationDays * 24 * 60 * 60 * 1000);
    const tolerance = 1000; // 1 second tolerance for floating point errors
    
    return Math.abs(countdown.endDate - expectedEndDate) < tolerance;
  }

  /**
   * Get countdown progress percentage (0-100)
   */
  getProgress(countdown: Countdown): number {
    const now = Date.now();
    const elapsed = now - countdown.startDate;
    const total = countdown.endDate - countdown.startDate;
    
    if (total <= 0) return 100;
    
    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return Math.round(progress);
  }

  /**
   * Check if a milestone threshold is reached
   */
  checkMilestone(countdown: Countdown, threshold: number): boolean {
    const remaining = this.getRemainingDays(countdown);
    return remaining === threshold;
  }

  /**
   * Get next milestone threshold
   */
  getNextMilestone(remainingDays: number): number | null {
    const milestones = [1000, 500, 100, 30, 7, 1];
    
    for (const milestone of milestones) {
      if (remainingDays >= milestone) {
        return milestone;
      }
    }
    
    return null;
  }
}

export const countdownService = new CountdownService();

