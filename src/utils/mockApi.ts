// Mock API utilities for travel booking app
import usersData from '../data/users.json';
import flightsData from '../data/flights.json';
import hotelsData from '../data/hotels.json';
import packagesData from '../data/packages.json';

export interface User {
  id: string;
  name: string;
  preferences: {
    purpose: string | null;
    budgetLevel: 'low' | 'mid' | 'high';
    preferredTags: string[];
  };
  history: Array<{
    type: string;
    tags: string[];
    price: number;
  }>;
}

export interface TravelItem {
  id: string;
  title: string;
  tags: string[];
  price: number;
  rating: number;
  imageUrl: string;
  trending?: boolean;
  details?: any;
}

export interface RecommendationRequest {
  userId: string;
  query?: string;
  purpose?: string;
  budgetLevel?: string;
  sessionId: string;
}

export interface RecommendationResponse {
  flights: Array<TravelItem & { score: number; reasons: string[] }>;
  hotels: Array<TravelItem & { score: number; reasons: string[] }>;
  packages: Array<TravelItem & { score: number; reasons: string[] }>;
}

export interface TrackingEvent {
  sessionId: string;
  userId: string;
  eventType: 'impression' | 'click' | 'booking';
  itemId: string;
  timestamp: number;
}

export interface Metrics {
  impressions: number;
  clicks: number;
  bookings: number;
  ctr: number;
  conversion: number;
  events: TrackingEvent[];
}

// In-memory metrics store
let metrics: Metrics = {
  impressions: 0,
  clicks: 0,
  bookings: 0,
  ctr: 0,
  conversion: 0,
  events: []
};

// Helper function to extract intent tags from query
function extractIntentTags(query: string): string[] {
  const queryLower = query.toLowerCase();
  const intentTags: string[] = [];
  
  // Emotional state mappings
  const emotionMap = {
    // Social/Group feelings
    'sad': ['family', 'resort', 'cultural'],
    'lonely': ['family', 'resort', 'city'],
    'isolated': ['family', 'resort', 'city'],
    'need friends': ['family', 'resort', 'city'],
    
    // Solo/Me time feelings  
    'me time': ['spa', 'relax', 'nature', 'beach'],
    'alone time': ['spa', 'relax', 'nature', 'beach'],
    'solo': ['adventure', 'nature', 'heritage', 'city'],
    'peace': ['spa', 'relax', 'nature', 'beach'],
    'quiet': ['spa', 'relax', 'nature'],
    
    // Relaxation feelings
    'chill': ['beach', 'resort', 'spa', 'relax'],
    'relax': ['beach', 'resort', 'spa', 'relax'],
    'tired': ['spa', 'resort', 'relax'],
    'stressed': ['spa', 'beach', 'relax', 'nature'],
    'overwhelmed': ['spa', 'beach', 'relax', 'nature'],
    
    // Adventure/Energy feelings
    'adventurous': ['adventure', 'nature', 'mountains'],
    'excited': ['adventure', 'city', 'cultural'],
    'energetic': ['adventure', 'city', 'shopping'],
    'bored': ['adventure', 'cultural', 'city'],
    'restless': ['adventure', 'nature', 'city'],
    
    // Romantic feelings
    'romantic': ['luxury', 'resort', 'beach'],
    'love': ['luxury', 'resort', 'beach'],
    'honeymoon': ['luxury', 'resort', 'beach'],
    
    // Cultural/Learning feelings
    'curious': ['cultural', 'heritage', 'city'],
    'learn': ['cultural', 'heritage', 'city'],
    'explore': ['cultural', 'adventure', 'city'],
    'discover': ['cultural', 'heritage', 'nature']
  };
  
  // Check for emotion-based tags
  for (const [emotion, tags] of Object.entries(emotionMap)) {
    if (queryLower.includes(emotion)) {
      intentTags.push(...tags);
    }
  }
  
  // Existing location/activity tags
  const knownTags = [
    'beach', 'city', 'business', 'leisure', 'family', 'luxury', 'budget',
    'resort', 'hotel', 'flight', 'package', 'tropical', 'cultural', 'heritage',
    'spa', 'adventure', 'relax', 'downtown', 'convenient', 'nature', 'temple',
    'backwaters', 'mountains', 'shopping', 'food', 'asia', 'europe', 'domestic',
    'international', 'economy', 'premium', 'business-class'
  ];
  
  // Add direct tag matches
  intentTags.push(...knownTags.filter(tag => queryLower.includes(tag)));
  
  // Remove duplicates
  return [...new Set(intentTags)];
}

// Recommendation scoring algorithm
function scoreItem(
  item: TravelItem, 
  user: User, 
  intentTags: string[], 
  budgetLevel?: string
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  
  // 1. Content-based scoring (tag matches)
  const userTags = user.preferences.preferredTags;
  const tagMatches = item.tags.filter(tag => userTags.includes(tag)).length;
  if (tagMatches > 0) {
    score += tagMatches * 2;
    reasons.push(`Matches your ${userTags.filter(tag => item.tags.includes(tag))[0]} preference`);
  }
  
  // 2. Intent boost from query
  const intentMatches = item.tags.filter(tag => intentTags.includes(tag)).length;
  if (intentMatches > 0) {
    score += intentMatches * 1.5;
    reasons.push(`Matches your search intent`);
  }
  
  // 3. Price sensitivity scoring
  const budget = budgetLevel || user.preferences.budgetLevel;
  let priceScore = 0;
  if (budget === 'low' && item.price < 10000) {
    priceScore = 2;
    reasons.push('Great value within budget');
  } else if (budget === 'mid' && item.price >= 10000 && item.price < 30000) {
    priceScore = 2;
    reasons.push('Perfect for your budget');
  } else if (budget === 'high' && item.price >= 30000) {
    priceScore = 1;
  } else if (budget === 'high') {
    priceScore = 0.5; // High budget users can afford anything
  }
  score += priceScore;
  
  // 4. Rating score (normalized)
  const ratingScore = (item.rating - 3) / 2 * 2; // Convert 3-5 to 0-2
  score += ratingScore;
  if (item.rating >= 4.5) {
    reasons.push('Highly rated by travelers');
  }
  
  // 5. Collaborative filtering (simulated)
  const historyTags = user.history.flatMap(h => h.tags);
  const collabMatches = item.tags.filter(tag => historyTags.includes(tag)).length;
  if (collabMatches > 0) {
    score += collabMatches * 1;
    reasons.push('Similar to your past trips');
  }
  
  // 6. Trending boost
  if (item.trending) {
    score += 1;
    reasons.push('Currently trending');
  }
  
  // 7. Cold start fallback - use popularity for new users
  if (user.preferences.preferredTags.length === 0) {
    score += item.rating + (item.trending ? 1 : 0);
  }
  
  return { score: Math.max(0, score), reasons: reasons.slice(0, 3) };
}

// Mock API functions
export const mockApi = {
  async getUsers(): Promise<User[]> {
    return usersData as User[];
  },
  
  async getCatalog(category: 'flights' | 'hotels' | 'packages'): Promise<TravelItem[]> {
    switch (category) {
      case 'flights': return flightsData as TravelItem[];
      case 'hotels': return hotelsData as TravelItem[];
      case 'packages': return packagesData as TravelItem[];
      default: return [];
    }
  },
  
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    const user = usersData.find(u => u.id === request.userId) as User;
    if (!user) throw new Error('User not found');
    
    const intentTags = request.query ? extractIntentTags(request.query) : [];
    
    const scoreItems = (items: TravelItem[]) => 
      items.map(item => ({
        ...item,
        ...scoreItem(item, user, intentTags, request.budgetLevel)
      })).sort((a, b) => b.score - a.score).slice(0, 3);
    
    const flights = scoreItems(flightsData as TravelItem[]);
    const hotels = scoreItems(hotelsData as TravelItem[]);
    const packages = scoreItems(packagesData as TravelItem[]);
    
    // Track impressions
    const impressionEvents: TrackingEvent[] = [
      ...flights.map(item => ({
        sessionId: request.sessionId,
        userId: request.userId,
        eventType: 'impression' as const,
        itemId: item.id,
        timestamp: Date.now()
      })),
      ...hotels.map(item => ({
        sessionId: request.sessionId,
        userId: request.userId,
        eventType: 'impression' as const,
        itemId: item.id,
        timestamp: Date.now()
      })),
      ...packages.map(item => ({
        sessionId: request.sessionId,
        userId: request.userId,
        eventType: 'impression' as const,
        itemId: item.id,
        timestamp: Date.now()
      }))
    ];
    
    metrics.impressions += impressionEvents.length;
    metrics.events.push(...impressionEvents);
    
    return { flights, hotels, packages };
  },
  
  async trackEvent(event: Omit<TrackingEvent, 'timestamp'>): Promise<Metrics> {
    const trackingEvent: TrackingEvent = {
      ...event,
      timestamp: Date.now()
    };
    
    metrics.events.push(trackingEvent);
    
    if (event.eventType === 'click') {
      metrics.clicks++;
    } else if (event.eventType === 'booking') {
      metrics.bookings++;
    }
    
    // Calculate rates
    metrics.ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
    metrics.conversion = metrics.clicks > 0 ? (metrics.bookings / metrics.clicks) * 100 : 0;
    
    return metrics;
  },
  
  async getMetrics(): Promise<Metrics> {
    return {
      ...metrics,
      events: metrics.events.slice(-20) // Return last 20 events
    };
  },
  
  resetMetrics() {
    metrics = {
      impressions: 0,
      clicks: 0,
      bookings: 0,
      ctr: 0,
      conversion: 0,
      events: []
    };
  }
};

// Generate session ID
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}