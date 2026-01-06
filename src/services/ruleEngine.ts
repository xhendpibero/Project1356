/**
 * Rule Engine for commitment categorization
 * Determines user's commitment mode based on setup choices
 */

import { CommitmentMode } from '../types';

export interface CategorizationResult {
  mode: CommitmentMode;
  deadlineType: 'GLOBAL_SHARED' | 'USER_DEFINED';
  philosophyAlignment: 'CANONICAL' | 'DISCIPLINED_VARIANT' | 'ADAPTIVE_VARIANT';
  description: string;
}

class RuleEngine {
  /**
   * Categorize user commitment based on goal count and duration
   */
  categorize(goalCount: number, durationDays: number): CategorizationResult {
    if (goalCount === 6 && durationDays === 1356) {
      return {
        mode: CommitmentMode.TEAM_MODE,
        deadlineType: 'GLOBAL_SHARED',
        philosophyAlignment: 'CANONICAL',
        description: 'You have chosen the canonical commitment: exactly 6 goals over exactly 1356 days. You share the global deadline with others who made the same choice. This represents alignment with the original Project 1356 philosophy.',
      };
    }

    if (goalCount === 6 && durationDays !== 1356) {
      return {
        mode: CommitmentMode.STRUCTURED_SOLO,
        deadlineType: 'USER_DEFINED',
        philosophyAlignment: 'DISCIPLINED_VARIANT',
        description: 'You have chosen structured commitment: 6 goals with a custom time horizon. This indicates disciplined structure while maintaining flexibility in duration.',
      };
    }

    return {
      mode: CommitmentMode.FLEXIBLE_SOLO,
      deadlineType: 'USER_DEFINED',
      philosophyAlignment: 'ADAPTIVE_VARIANT',
      description: 'You have chosen flexible commitment: a custom number of goals with a custom duration. This indicates an exploratory or adaptive commitment style.',
    };
  }

  /**
   * Get mode display name
   */
  getModeDisplayName(mode: CommitmentMode): string {
    switch (mode) {
      case CommitmentMode.TEAM_MODE:
        return 'Team Mode';
      case CommitmentMode.STRUCTURED_SOLO:
        return 'Structured Solo';
      case CommitmentMode.FLEXIBLE_SOLO:
        return 'Flexible Solo';
    }
  }
}

export const ruleEngine = new RuleEngine();

