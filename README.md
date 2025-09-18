# TravelAI - AI-Powered Travel Recommendations

🚀 **Deployed URL**: [TravelAI Live Demo](https://lovable.dev/projects/f0c28860-937b-4af5-bb5d-fb571141051a)

## Project Overview

TravelAI is a comprehensive travel booking prototype that demonstrates AI-powered personalized recommendations. The application showcases intelligent recommendation algorithms, real-time analytics, and user behavior tracking in a beautiful, modern interface.

### 🎯 Key Features

- **Smart Recommendations Engine** - Hybrid content-based + collaborative filtering
- **Real-time Personalization** - Adapts to user preferences and search intent
- **Analytics Dashboard** - Track impressions, clicks, conversions, and CTR
- **User Profile Management** - Test different user personas and preferences
- **Explainable AI** - Clear reasons why each recommendation is suggested
- **Interactive Search** - Natural language queries with instant results
- **Booking Simulation** - Complete flow from search to booking confirmation

### 🧠 AI Recommendation Algorithm

The recommendation engine uses a sophisticated hybrid approach:

1. **Content-Based Filtering** - Matches user preferences with item attributes
2. **Intent Recognition** - Extracts meaning from search queries
3. **Price Sensitivity** - Adapts to budget preferences (Budget/Moderate/Luxury)
4. **Rating Boost** - Prioritizes highly-rated options
5. **Collaborative Signals** - Simulates "users like you also liked"
6. **Trending Items** - Highlights popular destinations and deals
7. **Cold Start Handling** - Smart fallbacks for new users

### 👥 Demo User Personas

- **New Traveler** - Cold start scenario, no preferences or history
- **Sarah Johnson** - Leisure traveler, family-focused, beach preferences
- **Michael Chen** - Business traveler, luxury preferences, frequent flyer

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Deployment

**Vercel (Recommended)**
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically on each commit

**Manual Deployment**
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🧪 Testing the Recommendation System

### User Flow Testing
1. **Cold Start Test**: Select "New Traveler" → Notice generic but high-quality recommendations
2. **Personalization Test**: Switch to "Sarah Johnson" → See beach/family-focused results
3. **Business Travel Test**: Try "Michael Chen" → Observe luxury/business preferences
4. **Search Intent**: Try queries like "beach family Goa" or "business luxury Dubai"
5. **Analytics Flow**: Complete a booking journey and check dashboard metrics

### A/B Testing Scenarios
- Compare recommendation quality between different user types
- Test search queries vs. no search to see personalization differences
- Monitor conversion rates as you modify user preferences in admin panel

## 📊 Analytics & Metrics

The dashboard tracks:
- **Impressions** - How many recommendations shown
- **Clicks** - User engagement with recommendations  
- **Bookings** - Conversion to purchase intent
- **CTR** - Click-through rate (clicks/impressions)
- **Conversion Rate** - Booking rate (bookings/clicks)
- **Real-time Events** - Live activity feed

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks + local state
- **Data**: Mock JSON files (flights, hotels, packages, users)
- **Recommendation Engine**: JavaScript-based scoring algorithm
- **Analytics**: In-memory event tracking with persistence simulation

## 📁 Project Structure

```
src/
├── components/           # UI Components
│   ├── ui/              # shadcn/ui base components
│   ├── Header.tsx       # Navigation header
│   ├── SearchBar.tsx    # Search input with real-time updates
│   ├── ContextCard.tsx  # User preference selector
│   ├── RecommendationCard.tsx  # Individual recommendation display
│   ├── ItemModal.tsx    # Detailed item view
│   ├── Dashboard.tsx    # Analytics dashboard
│   └── AdminPanel.tsx   # User management interface
├── data/                # Mock data files
│   ├── users.json       # User profiles and preferences
│   ├── flights.json     # Flight inventory
│   ├── hotels.json      # Hotel inventory
│   └── packages.json    # Package deals
├── utils/
│   └── mockApi.ts       # API simulation + recommendation engine
├── pages/
│   └── Index.tsx        # Main application
└── hooks/               # Custom React hooks
```

## 🎨 Design System

The app features a travel-themed design system:
- **Colors**: Ocean blues, sunset oranges, clean whites
- **Gradients**: Hero gradients, card backgrounds, button styling
- **Typography**: Modern, readable fonts with proper hierarchy
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design with breakpoint adaptations

## 🔧 Customization

### Adding New Recommendations
1. Edit JSON files in `/src/data/`
2. Add new tags for better categorization
3. Restart dev server to load new data

### Modifying Algorithm Weights
In `src/utils/mockApi.ts`, adjust scoring weights:
```javascript
// Final score calculation
score = w1*tagMatches + w2*intentBoost + w3*priceScore + w4*ratingScore + w5*collabScore
```

### Creating New User Types
Add entries to `src/data/users.json` with different:
- Preferences (purpose, budget, tags)
- History (past bookings for collaborative filtering)
- Demographics (for cold start scenarios)

## 📈 Success Metrics

The app demonstrates successful AI implementation through:
- **Relevance**: Users see items matching their preferences
- **Diversity**: Recommendations span multiple categories appropriately
- **Explainability**: Clear reasons for each recommendation
- **Performance**: Fast response times for real-time search
- **Engagement**: High CTR when recommendations match user intent

## 🚀 Production Considerations

For a real-world deployment:
- Replace mock data with actual APIs (flights, hotels)
- Implement proper user authentication
- Add database persistence for user profiles and analytics
- Scale recommendation engine with ML frameworks
- Add A/B testing framework for algorithm optimization
- Implement proper error handling and loading states
- Add comprehensive logging and monitoring

## 📝 API Specification

### Endpoints (Simulated)
- `GET /api/users` - User profiles
- `GET /api/catalog/:category` - Travel inventory
- `POST /api/recommendations` - Get personalized recommendations
- `POST /api/track` - Track user events
- `GET /api/metrics` - Analytics summary

### Recommendation Request
```javascript
{
  userId: "user_id",
  query: "search query", 
  purpose: "business|leisure",
  budgetLevel: "low|mid|high",
  sessionId: "session_uuid"
}
```

### Recommendation Response
```javascript
{
  flights: [{...item, score: 8.5, reasons: ["Matches your beach preference"]}],
  hotels: [{...item, score: 7.2, reasons: ["Within your budget", "High rating"]}],
  packages: [{...item, score: 9.1, reasons: ["Perfect for business travel"]}]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with different user scenarios
5. Submit a pull request

---

**Built with ❤️ using React + AI-powered recommendations**