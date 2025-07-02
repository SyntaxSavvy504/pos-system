export interface LoyaltyTier {
  id: string
  name: string
  minSpent: number
  discountPercentage: number
  pointsMultiplier: number
  benefits: string[]
}

export interface LoyaltyCustomer {
  customerId: string
  points: number
  totalSpent: number
  tier: string
  joinDate: string
  lastActivity: string
}

export class LoyaltySystem {
  private static tiers: LoyaltyTier[] = [
    {
      id: "bronze",
      name: "Bronze",
      minSpent: 0,
      discountPercentage: 0,
      pointsMultiplier: 1,
      benefits: ["Basic rewards", "Birthday discount"],
    },
    {
      id: "silver",
      name: "Silver",
      minSpent: 500,
      discountPercentage: 5,
      pointsMultiplier: 1.5,
      benefits: ["5% discount", "Priority support", "Early access to sales"],
    },
    {
      id: "gold",
      name: "Gold",
      minSpent: 1500,
      discountPercentage: 10,
      pointsMultiplier: 2,
      benefits: ["10% discount", "Free shipping", "Exclusive products", "Personal shopper"],
    },
    {
      id: "platinum",
      name: "Platinum",
      minSpent: 5000,
      discountPercentage: 15,
      pointsMultiplier: 3,
      benefits: ["15% discount", "VIP events", "Concierge service", "Custom orders"],
    },
  ]

  static getTiers(): LoyaltyTier[] {
    return this.tiers
  }

  static getTierInfo(tierId: string): LoyaltyTier | undefined {
    return this.tiers.find((tier) => tier.id === tierId)
  }

  static calculateTier(totalSpent: number): LoyaltyTier {
    const sortedTiers = this.tiers.sort((a, b) => b.minSpent - a.minSpent)
    return sortedTiers.find((tier) => totalSpent >= tier.minSpent) || this.tiers[0]
  }

  static calculatePoints(amount: number, tier: LoyaltyTier): number {
    return Math.floor(amount * tier.pointsMultiplier)
  }

  static calculateDiscount(amount: number, tier: LoyaltyTier): number {
    return amount * (tier.discountPercentage / 100)
  }

  static getNextTier(currentTier: LoyaltyTier): LoyaltyTier | null {
    const currentIndex = this.tiers.findIndex((tier) => tier.id === currentTier.id)
    return currentIndex < this.tiers.length - 1 ? this.tiers[currentIndex + 1] : null
  }

  static getProgressToNextTier(
    totalSpent: number,
    currentTier: LoyaltyTier,
  ): {
    progress: number
    remaining: number
    nextTier: LoyaltyTier | null
  } {
    const nextTier = this.getNextTier(currentTier)
    if (!nextTier) {
      return { progress: 100, remaining: 0, nextTier: null }
    }

    const progress = ((totalSpent - currentTier.minSpent) / (nextTier.minSpent - currentTier.minSpent)) * 100
    const remaining = nextTier.minSpent - totalSpent

    return {
      progress: Math.min(progress, 100),
      remaining: Math.max(remaining, 0),
      nextTier,
    }
  }
}
