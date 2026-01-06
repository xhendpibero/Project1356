/**
 * Core type definitions for Project 1356
 */

export enum CommitmentMode {
  TEAM_MODE = 'TEAM_MODE',
  STRUCTURED_SOLO = 'STRUCTURED_SOLO',
  FLEXIBLE_SOLO = 'FLEXIBLE_SOLO',
}

export interface Goal {
  id: string;
  title: string;
  detail: string;
  locked: boolean;
  icon?: string;
}

export interface Countdown {
  startDate: number; // Unix timestamp (milliseconds)
  durationDays: number;
  endDate: number; // Calculated end date
}

export interface UserCommitment {
  mode: CommitmentMode;
  goalCount: number;
  durationDays: number;
  goals: Goal[];
  countdown: Countdown;
  createdAt: number;
}

export interface AppState {
  isOnboarded: boolean;
  commitment?: UserCommitment;
}

export interface OnboardingState {
  hasSeenContext: boolean;
  hasGrantedNotifications: boolean;
  hasGrantedPhotoAccess: boolean;
}

