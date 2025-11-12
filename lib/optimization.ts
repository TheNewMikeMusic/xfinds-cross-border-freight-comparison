import { CartItem } from '@/store/cart-store'
import { Product, Agent, ProductOffer } from '@/lib/data'
import { groupCartItemsByAgent, calculateCartTotal } from './cart-utils'

export interface OptimizationResult {
  optimizedItems: CartItem[]
  savings: number
  changes: Array<{
    offerId: string
    fromAgentId: string
    toAgentId: string
  }>
}

/**
 * Optimize cart items by finding the best agent assignment for each item
 * to minimize total cost (price + shipping)
 */
export function optimizeCartItems(
  items: CartItem[],
  agents: Agent[],
  products: Product[]
): OptimizationResult {
  if (items.length === 0) {
    return {
      optimizedItems: [],
      savings: 0,
      changes: [],
    }
  }

  // Calculate current total cost
  const currentGroups = groupCartItemsByAgent(items, agents)
  const currentTotal = calculateCartTotal(currentGroups)

  // Helper function to get product for an item
  const getProductForItem = (item: CartItem): Product | null => {
    return products.find((p) => p.id === item.productId) || null
  }

  // Build a map of available offers for each item
  const itemOptions = new Map<string, Array<{ agentId: string; offer: Pick<ProductOffer, 'price' | 'shipFee' | 'link'> }>>()

  items.forEach((item) => {
    const product = getProductForItem(item)
    if (!product) return

    const options: Array<{ agentId: string; offer: Pick<ProductOffer, 'price' | 'shipFee' | 'link'> }> = []
    product.offers.forEach((offer) => {
      options.push({
        agentId: offer.agentId,
        offer: {
          price: offer.price,
          shipFee: offer.shipFee,
          link: offer.link,
        },
      })
    })

    if (options.length > 0) {
      itemOptions.set(item.offerId, options)
    }
  })

  // Use greedy algorithm: for each item, choose the agent that minimizes
  // the total cost considering both item price and shipping
  // We'll try all combinations for small sets, or use greedy for large sets
  const optimizedItems: CartItem[] = []
  const changes: Array<{ offerId: string; fromAgentId: string; toAgentId: string }> = []

  // If we have few items, try all combinations
  // Otherwise use greedy approach
  if (items.length <= 6) {
    // Try all possible combinations (brute force for small sets)
    const bestAssignment = findBestAssignmentBruteForce(items, itemOptions, agents)
    
    items.forEach((item) => {
      const assignment = bestAssignment.get(item.offerId)
      if (!assignment) {
        optimizedItems.push(item)
        return
      }

      const { agentId, offer } = assignment
      const newItem: CartItem = {
        ...item,
        agentId,
        price: offer.price,
        shipFee: offer.shipFee,
        link: offer.link,
      }

      optimizedItems.push(newItem)

      if (item.agentId !== agentId) {
        changes.push({
          offerId: item.offerId,
          fromAgentId: item.agentId,
          toAgentId: agentId,
        })
      }
    })
  } else {
    // Greedy approach for larger sets
    // For each item, choose the agent that gives the best total cost
    items.forEach((item) => {
      const options = itemOptions.get(item.offerId)
      if (!options || options.length === 0) {
        optimizedItems.push(item)
        return
      }

      // Calculate cost for each option
      // We need to consider grouping effects, so we'll simulate grouping
      let bestOption = options[0]
      let bestCost = Infinity

      options.forEach((option) => {
        // Create a temporary item with this agent
        const tempItem: CartItem = {
          ...item,
          agentId: option.agentId,
          price: option.offer.price,
          shipFee: option.offer.shipFee,
          link: option.offer.link,
        }

        // Calculate cost: price + shipping
        const cost = tempItem.price + tempItem.shipFee

        if (cost < bestCost) {
          bestCost = cost
          bestOption = option
        }
      })

      const newItem: CartItem = {
        ...item,
        agentId: bestOption.agentId,
        price: bestOption.offer.price,
        shipFee: bestOption.offer.shipFee,
        link: bestOption.offer.link,
      }

      optimizedItems.push(newItem)

      if (item.agentId !== bestOption.agentId) {
        changes.push({
          offerId: item.offerId,
          fromAgentId: item.agentId,
          toAgentId: bestOption.agentId,
        })
      }
    })
  }

  // Calculate new total cost
  const optimizedGroups = groupCartItemsByAgent(optimizedItems, agents)
  const optimizedTotal = calculateCartTotal(optimizedGroups)
  const savings = currentTotal - optimizedTotal

  return {
    optimizedItems,
    savings: Math.max(0, savings), // Ensure non-negative
    changes,
  }
}

/**
 * Brute force approach: try all possible agent assignments
 * Only used for small item sets (<= 6 items)
 */
function findBestAssignmentBruteForce(
  items: CartItem[],
  itemOptions: Map<string, Array<{ agentId: string; offer: Pick<ProductOffer, 'price' | 'shipFee' | 'link'> }>>,
  agents: Agent[]
): Map<string, { agentId: string; offer: Pick<ProductOffer, 'price' | 'shipFee' | 'link'> }> {
  // Generate all possible combinations
  const combinations: Array<Map<string, { agentId: string; offer: Pick<ProductOffer, 'price' | 'shipFee' | 'link'> }>> = []

  function generateCombinations(
    index: number,
    currentAssignment: Map<string, { agentId: string; offer: Pick<ProductOffer, 'price' | 'shipFee' | 'link'> }>
  ) {
    if (index >= items.length) {
      combinations.push(new Map(currentAssignment))
      return
    }

    const item = items[index]
    const options = itemOptions.get(item.offerId) || []

    if (options.length === 0) {
      // No options, keep current assignment
      generateCombinations(index + 1, currentAssignment)
      return
    }

    options.forEach((option) => {
      const newAssignment = new Map(currentAssignment)
      newAssignment.set(item.offerId, option)
      generateCombinations(index + 1, newAssignment)
    })
  }

  generateCombinations(0, new Map())

  // Evaluate each combination and find the best one
  let bestAssignment: Map<string, { agentId: string; offer: any }> | null = null
  let bestTotal = Infinity

  combinations.forEach((assignment) => {
    // Build cart items with this assignment
    const testItems: CartItem[] = items.map((item) => {
      const assigned = assignment.get(item.offerId)
      if (!assigned) return item

      return {
        ...item,
        agentId: assigned.agentId,
        price: assigned.offer.price,
        shipFee: assigned.offer.shipFee,
        link: assigned.offer.link,
      }
    })

    // Calculate total cost
    const groups = groupCartItemsByAgent(testItems, agents)
    const total = calculateCartTotal(groups)

    if (total < bestTotal) {
      bestTotal = total
      bestAssignment = assignment
    }
  })

  return bestAssignment || new Map()
}

