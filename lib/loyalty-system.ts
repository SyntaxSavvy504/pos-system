export interface LoyaltyTier {
  name: "Bronze" | "Silver" | "Gold" | "Platinum"
  minSpent: number
  pointsMultiplier: number
  color: string
  benefits: string[]
}

export interface LoyaltyCustomer {
  id: string
  name: string
  email: string
  phone: string
  loyaltyNumber: string
  points: number
  tier: "Bronze" | "Silver" | "Gold" | "Platinum"
  totalSpent: number
  joinDate: string
  lastActivity: string
  pointsHistory: PointsTransaction[]
  rewardsRedeemed: RewardRedemption[]
}

export interface LoyaltyReward {
  id: string
  name: string
  description: string
  pointsCost: number
  discountType: "percentage" | "fixed"
  discountValue: number
  minPurchase?: number
  maxDiscount?: number
  tierRequirement?: "Bronze" | "Silver" | "Gold" | "Platinum"
  isActive: boolean
  usedCount: number
  expiryDate?: string
}

export interface PointsTransaction {
  id: string
  type: "earned" | "redeemed" | "expired" | "bonus"
  points: number
  description: string
  transactionId?: string
  timestamp: string
}

export interface RewardRedemption {
  id: string
  rewardId: string
  rewardName: string
  pointsCost: number
  timestamp: string
}

export class LoyaltySystem {
  static readonly TIERS: LoyaltyTier[] = [
    {
      name: "Bronze",
      minSpent: 0,
      pointsMultiplier: 1,
      color: "#CD7F32",
      benefits: ["1 point per $1 spent", "Birthday discount"],
    },
    {
      name: "Silver",
      minSpent: 500,
      pointsMultiplier: 1.25,
      color: "#C0C0C0",
      benefits: ["1.25 points per $1 spent", "Early access to sales", "Free shipping"],
    },
    {
      name: "Gold",
      minSpent: 1500,
      pointsMultiplier: 1.5,
      color: "#FFD700",
      benefits: ["1.5 points per $1 spent", "Priority customer service", "Exclusive offers"],
    },
    {
      name: "Platinum",
      minSpent: 5000,
      pointsMultiplier: 2,
      color: "#E5E4E2",
      benefits: ["2 points per $1 spent", "Personal shopping assistant", "VIP events"],
    },
  ]

  static readonly DEFAULT_REWARDS: LoyaltyReward[] = [
    {
      id: "reward-1",
      name: "$5 Off Purchase",
      description: "Get $5 off your next purchase",
      pointsCost: 500,
      discountType: "fixed",
      discountValue: 5,
      minPurchase: 25,
      isActive: true,
      usedCount: 0,
    },
    {
      id: "reward-2",
      name: "10% Off Purchase",
      description: "Get 10% off your entire purchase",
      pointsCost: 750,
      discountType: "percentage",
      discountValue: 10,
      minPurchase: 50,
      maxDiscount: 25,
      isActive: true,
      usedCount: 0,
    },
    {
      id: "reward-3",
      name: "$20 Off Purchase",
      description: "Get $20 off your next purchase",
      pointsCost: 2000,
      discountType: "fixed",
      discountValue: 20,
      minPurchase: 100,
      tierRequirement: "Silver",
      isActive: true,
      usedCount: 0,
    },
  ]

  static generateLoyaltyNumber(): string {
    const prefix = "LOY"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${prefix}${timestamp}${random}`
  }

  static determineTier(totalSpent: number): "Bronze" | "Silver" | "Gold" | "Platinum" {
    if (totalSpent >= this.TIERS[3].minSpent) return "Platinum"
    if (totalSpent >= this.TIERS[2].minSpent) return "Gold"
    if (totalSpent >= this.TIERS[1].minSpent) return "Silver"
    return "Bronze"
  }

  static getTierInfo(tierName: "Bronze" | "Silver" | "Gold" | "Platinum"): LoyaltyTier {
    const tier = this.TIERS.find((t) => t.name === tierName)
    if (!tier) {
      return this.TIERS[0] // Return Bronze as default
    }
    return tier
  }

  static calculatePointsEarned(amount: number, tier: "Bronze" | "Silver" | "Gold" | "Platinum"): number {
    const tierInfo = this.getTierInfo(tier)
    const basePoints = Math.floor(amount) // 1 point per dollar
    return Math.floor(basePoints * tierInfo.pointsMultiplier)
  }

  static canRedeemReward(customer: LoyaltyCustomer, reward: LoyaltyReward): boolean {
    if (!reward.isActive) return false
    if (customer.points < reward.pointsCost) return false
    if (reward.tierRequirement && !this.meetsTierRequirement(customer.tier, reward.tierRequirement)) return false
    return true
  }

  static meetsTierRequirement(
    customerTier: "Bronze" | "Silver" | "Gold" | "Platinum",
    requiredTier: "Bronze" | "Silver" | "Gold" | "Platinum",
  ): boolean {
    const tierOrder = ["Bronze", "Silver", "Gold", "Platinum"]
    const customerIndex = tierOrder.indexOf(customerTier)
    const requiredIndex = tierOrder.indexOf(requiredTier)
    return customerIndex >= requiredIndex
  }

  static calculateRewardDiscount(reward: LoyaltyReward, purchaseAmount: number): number {
    if (reward.minPurchase && purchaseAmount < reward.minPurchase) return 0

    if (reward.discountType === "fixed") {
      return Math.min(reward.discountValue, purchaseAmount)
    } else {
      const discount = (purchaseAmount * reward.discountValue) / 100
      return reward.maxDiscount ? Math.min(discount, reward.maxDiscount) : discount
    }
  }

  static getNextTierProgress(customer: LoyaltyCustomer): {
    nextTier: "Silver" | "Gold" | "Platinum" | null
    amountNeeded: number
    progress: number
  } {
    const currentSpent = customer.totalSpent
    const currentTier = customer.tier

    if (currentTier === "Platinum") {
      return { nextTier: null, amountNeeded: 0, progress: 100 }
    }

    let nextTier: "Silver" | "Gold" | "Platinum"
    let nextThreshold: number

    if (currentTier === "Bronze") {
      nextTier = "Silver"
      nextThreshold = this.TIERS[1].minSpent
    } else if (currentTier === "Silver") {
      nextTier = "Gold"
      nextThreshold = this.TIERS[2].minSpent
    } else {
      nextTier = "Platinum"
      nextThreshold = this.TIERS[3].minSpent
    }

    const amountNeeded = nextThreshold - currentSpent
    const currentTierIndex = this.TIERS.findIndex((t) => t.name === currentTier)
    const currentTierThreshold = this.TIERS[currentTierIndex].minSpent
    const progress = ((currentSpent - currentTierThreshold) / (nextThreshold - currentTierThreshold)) * 100

    return { nextTier, amountNeeded: Math.max(0, amountNeeded), progress: Math.min(100, Math.max(0, progress)) }
  }
}
