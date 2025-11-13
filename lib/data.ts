import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')

export type AgentId = 'kakobuy' | 'mulebuy' | 'hipobuy' | 'rizzitgo' | 'eastmallbuy' | 'tigbuy'

export interface Agent {
  id: AgentId
  name: string
  slug: string
  rating: number
  badges: string[]
  speedTag: string
  logo: string
  siteUrl: string
  promoText?: string
  recommended?: boolean
  notes?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

export interface ProductOffer {
  agentId: string
  title: string
  price: number
  shipFee: number
  estDays: number
  currency: string
  link: string
  inStock: boolean
}

export interface ProductSKUOption {
  name: string // e.g., "Color", "Size"
  values: string[] // e.g., ["Black", "White", "Red"]
}

export interface Product {
  id: string
  slug: string
  title: string
  brand: string
  categoryId: string
  cover: string
  gallery: string[]
  priceGuide: {
    min: number
    max: number
    currency: string
  }
  tags: string[]
  description?: string
  specs: {
    [key: string]: string | undefined
  }
  skuOptions?: ProductSKUOption[] // Optional SKU options like color, size
  createdAt: string
  offers: ProductOffer[]
}

export function readAgents(): Agent[] {
  const filePath = join(DATA_DIR, 'agents.json')
  const fileContents = readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContents)
}

// Cache with TTL (Time To Live)
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

let agentsCache: CacheEntry<Agent[]> | null = null
let categoriesCache: CacheEntry<Category[]> | null = null
let productsCache: CacheEntry<Product[]> | null = null

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function isCacheValid<T>(cache: CacheEntry<T> | null): boolean {
  if (!cache) return false
  return Date.now() - cache.timestamp < cache.ttl
}

function getCachedData<T>(
  cache: CacheEntry<T> | null,
  fetcher: () => T,
  ttl: number = CACHE_TTL
): T {
  if (isCacheValid(cache)) {
    return cache!.data
  }
  const data = fetcher()
  return data
}

export function getAgents(): Agent[] {
  if (!isCacheValid(agentsCache)) {
    agentsCache = {
      data: readAgents(),
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    }
  }
  return agentsCache!.data
}

export function getCategories(): Category[] {
  if (!isCacheValid(categoriesCache)) {
    categoriesCache = {
      data: readCategories(),
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    }
  }
  return categoriesCache!.data
}

export function getProducts(): Product[] {
  if (!isCacheValid(productsCache)) {
    productsCache = {
      data: readProducts(),
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    }
  }
  return productsCache!.data
}

// Invalidate cache when data is modified
export function invalidateCache(): void {
  agentsCache = null
  categoriesCache = null
  productsCache = null
}

export function readCategories(): Category[] {
  const filePath = join(DATA_DIR, 'categories.json')
  const fileContents = readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContents)
}

export function readProducts(): Product[] {
  const filePath = join(DATA_DIR, 'products.json')
  const fileContents = readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContents)
}

export function getProductBySlug(slug: string): Product | null {
  const products = getProducts()
  return products.find((p) => p.slug === slug) || null
}

export function getProductById(id: string): Product | null {
  const products = getProducts()
  return products.find((p) => p.id === id) || null
}

export function getAgentById(id: string): Agent | null {
  const agents = getAgents()
  return agents.find((a) => a.id === id) || null
}

export function getCategoryById(id: string): Category | null {
  const categories = getCategories()
  return categories.find((c) => c.id === id) || null
}

export function getFeaturedProducts(limit: number = 6): Product[] {
  const products = getProducts()
  return products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export function getProductsByCategory(categoryId: string, limit: number = 3): Product[] {
  const products = getProducts()
  return products
    .filter((p) => p.categoryId === categoryId)
    .filter((p) => p.cover && !p.cover.includes('/images/products/') && !p.cover.includes('example.com'))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export function getCategoriesWithProducts(): Array<Category & { productCount: number; sampleProducts: Product[] }> {
  const categories = getCategories()
  const products = getProducts()
  const validProducts = products.filter((p) => p.cover && !p.cover.includes('/images/products/') && !p.cover.includes('example.com'))
  
  return categories
    .map((category) => {
      const categoryProducts = validProducts.filter((p) => p.categoryId === category.id)
      
      let sortedProducts: Product[]
      
      // Special handling for Electronics category: ensure earbuds (prod-25) is on the right (second position)
      if (category.id === 'cat-5') {
        const earbudsProduct = categoryProducts.find((p) => p.id === 'prod-25')
        const otherProducts = categoryProducts.filter((p) => p.id !== 'prod-25')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        
        if (earbudsProduct && otherProducts.length > 0) {
          // Put earbuds in second position (right side)
          sortedProducts = [otherProducts[0], earbudsProduct]
        } else {
          // Fallback to default sorting
          sortedProducts = categoryProducts
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
      } else {
        // Prefer products with clean backgrounds (prioritize newer products, but try to get variety)
        sortedProducts = categoryProducts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }
      
      return {
        ...category,
        productCount: categoryProducts.length,
        sampleProducts: sortedProducts.slice(0, 2), // Only need 2 products for left/right layout
      }
    })
    .filter((cat) => cat.productCount > 0)
    .sort((a, b) => b.productCount - a.productCount)
}

// Development-only write functions
export function writeProduct(product: Product): void {
  if (process.env.NODE_ENV !== 'development' && !process.env.ADMIN_TOKEN) {
    throw new Error('Product creation is only allowed in development mode')
  }

  const filePath = join(DATA_DIR, 'products.json')
  const products = readProducts()
  products.push(product)
  writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8')
  // Invalidate cache after write
  invalidateCache()
}

export function writeProducts(products: Product[]): void {
  if (process.env.NODE_ENV !== 'development' && !process.env.ADMIN_TOKEN) {
    throw new Error('Product modification is only allowed in development mode')
  }

  const filePath = join(DATA_DIR, 'products.json')
  writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8')
  // Invalidate cache after write
  invalidateCache()
}

