/**
 * Subscription tier definitions and utilities
 * This module handles free vs premium tier logic and rate limiting
 */

export type SubscriptionTier = "free" | "premium";

export interface SubscriptionLimits {
  resumesPerMonth: number;
  coverLettersPerMonth: number;
  hasAdvancedFeatures: boolean;
  hasPrioritySupport: boolean;
}

export interface UserUsage {
  resumesGenerated: number;
  coverLettersGenerated: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

/**
 * Get subscription limits based on tier
 */
export function getSubscriptionLimits(tier: SubscriptionTier): SubscriptionLimits {
  if (tier === "premium") {
    return {
      resumesPerMonth: Infinity,
      coverLettersPerMonth: Infinity,
      hasAdvancedFeatures: true,
      hasPrioritySupport: true,
    };
  }

  // Free tier limits
  return {
    resumesPerMonth: 3,
    coverLettersPerMonth: 3,
    hasAdvancedFeatures: false,
    hasPrioritySupport: false,
  };
}

/**
 * Check if user can generate a document based on their tier and usage
 */
export function canGenerateDocument(
  tier: SubscriptionTier,
  documentType: "resume" | "cover-letter",
  usage: UserUsage
): {
  allowed: boolean;
  reason?: string;
  remaining?: number;
} {
  const limits = getSubscriptionLimits(tier);

  // Premium users have unlimited access
  if (tier === "premium") {
    return { allowed: true };
  }

  // Check if we need to reset usage (new billing period)
  const now = new Date();
  if (now > usage.currentPeriodEnd) {
    // Usage should be reset - in production, this would be handled by the database
    return { 
      allowed: true,
      remaining: documentType === "resume" ? limits.resumesPerMonth - 1 : limits.coverLettersPerMonth - 1
    };
  }

  // Check usage against limits
  if (documentType === "resume") {
    const remaining = limits.resumesPerMonth - usage.resumesGenerated;
    if (remaining <= 0) {
      return {
        allowed: false,
        reason: "Monthly resume generation limit reached. Upgrade to Premium for unlimited access.",
        remaining: 0,
      };
    }
    return { allowed: true, remaining: remaining - 1 };
  } else {
    const remaining = limits.coverLettersPerMonth - usage.coverLettersGenerated;
    if (remaining <= 0) {
      return {
        allowed: false,
        reason: "Monthly cover letter generation limit reached. Upgrade to Premium for unlimited access.",
        remaining: 0,
      };
    }
    return { allowed: true, remaining: remaining - 1 };
  }
}

/**
 * Calculate usage percentage for UI display
 */
export function getUsagePercentage(
  tier: SubscriptionTier,
  documentType: "resume" | "cover-letter",
  usage: UserUsage
): number {
  if (tier === "premium") {
    return 0; // No limits for premium
  }

  const limits = getSubscriptionLimits(tier);
  const used = documentType === "resume" ? usage.resumesGenerated : usage.coverLettersGenerated;
  const limit = documentType === "resume" ? limits.resumesPerMonth : limits.coverLettersPerMonth;

  return Math.min((used / limit) * 100, 100);
}

/**
 * Get the next billing period dates
 */
export function getNextBillingPeriod(currentPeriodEnd: Date): {
  start: Date;
  end: Date;
} {
  const start = new Date(currentPeriodEnd);
  const end = new Date(currentPeriodEnd);
  end.setMonth(end.getMonth() + 1);

  return { start, end };
}

/**
 * Initialize usage for a new user or billing period
 */
export function initializeUsage(): UserUsage {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  return {
    resumesGenerated: 0,
    coverLettersGenerated: 0,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
  };
}
