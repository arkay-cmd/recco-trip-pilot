import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { ContextCard } from "@/components/ContextCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { ItemModal } from "@/components/ItemModal";
import { Dashboard } from "@/components/Dashboard";
import { AdminPanel } from "@/components/AdminPanel";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plane, Hotel, Package, Sparkles, TrendingUp, MapPin } from "lucide-react";
import { 
  mockApi, 
  User, 
  TravelItem, 
  RecommendationResponse, 
  Metrics, 
  generateSessionId 
} from "@/utils/mockApi";

const Index = () => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [selectedItem, setSelectedItem] = useState<(TravelItem & { score: number; reasons: string[] }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'admin'>('home');
  const [sessionId] = useState(generateSessionId());
  const [searchQuery, setSearchQuery] = useState("");
  const [context, setContext] = useState({
    purpose: undefined,
    budgetLevel: undefined,
    selectedTags: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadUsers();
    loadMetrics();
  }, []);

  const loadUsers = async () => {
    try {
      const userData = await mockApi.getUsers();
      setUsers(userData);
      // Set default user to new_user for cold start demo
      const defaultUser = userData.find(u => u.id === 'new_user') || userData[0];
      setCurrentUser(defaultUser);
    } catch (error) {
      toast({
        title: "Error loading users",
        description: "Could not load user data",
        variant: "destructive"
      });
    }
  };

  const loadMetrics = async () => {
    try {
      const metricsData = await mockApi.getMetrics();
      setMetrics(metricsData);
    } catch (error) {
      console.error("Error loading metrics:", error);
    }
  };

  // Get recommendations
  const fetchRecommendations = async (query?: string, contextOverrides?: any) => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const requestContext = { ...context, ...contextOverrides };
      const response = await mockApi.getRecommendations({
        userId: currentUser.id,
        query: query || searchQuery,
        purpose: requestContext.purpose,
        budgetLevel: requestContext.budgetLevel,
        sessionId
      });
      setRecommendations(response);
      
      // Show success message for new searches
      if (query && query.length > 0) {
        toast({
          title: "Recommendations updated",
          description: `Found ${response.flights.length + response.hotels.length + response.packages.length} personalized results`
        });
      }
      
      // Refresh metrics after impressions
      setTimeout(loadMetrics, 100);
    } catch (error) {
      toast({
        title: "Error getting recommendations",
        description: "Could not load recommendations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch recommendations when user or context changes
  useEffect(() => {
    if (currentUser) {
      fetchRecommendations();
    }
  }, [currentUser, context]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchRecommendations(query);
  };

  // Handle context changes
  const handleContextChange = (newContext: any) => {
    setContext(newContext);
  };

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setSearchQuery(""); // Reset search when switching users
      toast({
        title: `Switched to ${user.name}`,
        description: "Recommendations will update based on this user's profile"
      });
    }
  };

  // Handle user updates (from admin panel)
  const handleUserUpdate = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, ...updates }
        : user
    ));
    
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }

    toast({
      title: "User updated",
      description: "Preferences saved successfully"
    });
  };

  // Handle item interactions
  const handleViewItem = async (item: TravelItem & { score: number; reasons: string[] }) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    
    // Track click event
    try {
      await mockApi.trackEvent({
        sessionId,
        userId: currentUser?.id || 'unknown',
        eventType: 'click',
        itemId: item.id
      });
      loadMetrics();
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  const handleBookItem = async () => {
    if (!selectedItem || !currentUser) return;

    try {
      await mockApi.trackEvent({
        sessionId,
        userId: currentUser.id,
        eventType: 'booking',
        itemId: selectedItem.id
      });
      
      toast({
        title: "Booking Confirmed! 🎉",
        description: `Your booking for ${selectedItem.title} has been confirmed. Have a great trip!`
      });
      
      loadMetrics();
    } catch (error) {
      toast({
        title: "Booking error",
        description: "Could not process booking",
        variant: "destructive"
      });
    }
  };

  // Handle navigation
  const handleNavigate = (page: 'home' | 'dashboard' | 'admin') => {
    setCurrentPage(page);
  };

  // Reset metrics
  const handleResetMetrics = () => {
    mockApi.resetMetrics();
    loadMetrics();
    toast({
      title: "Metrics reset",
      description: "All analytics data has been cleared"
    });
  };

  // Loading state
  if (!currentUser || !users.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-hero">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading TravelAI...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        users={users}
        currentUser={currentUser}
        onUserSelect={handleUserSelect}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
              <div className="space-y-4">
                <Badge className="bg-gradient-sunset text-white px-4 py-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI-Powered Travel Recommendations
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Discover Your Perfect Trip
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Personalized travel recommendations powered by AI. 
                  Find flights, hotels, and packages tailored just for you.
                </p>
              </div>

              {/* User Info */}
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-ocean rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {currentUser.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{currentUser.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentUser.preferences.preferredTags.length > 0 
                        ? `Interests: ${currentUser.preferences.preferredTags.slice(0, 2).join(', ')}`
                        : 'New to travel planning'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Context Card */}
            <ContextCard 
              onContextChange={handleContextChange}
              initialContext={{
                purpose: currentUser.preferences.purpose || undefined,
                budgetLevel: currentUser.preferences.budgetLevel,
                selectedTags: currentUser.preferences.preferredTags
              }}
            />

            {/* Recommendations */}
            {recommendations && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Personalized Recommendations
                  </h2>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `Results for "${searchQuery}" tailored to your preferences`
                      : `Curated selections based on your profile`}
                  </p>
                </div>

                {/* Recommendation Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Flights */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Plane className="h-6 w-6 text-primary" />
                      <h3 className="text-2xl font-bold">Flights</h3>
                      <Badge variant="secondary">{recommendations.flights.length}</Badge>
                    </div>
                    <div className="space-y-4">
                      {recommendations.flights.map((flight) => (
                        <RecommendationCard
                          key={flight.id}
                          item={flight}
                          onView={() => handleViewItem(flight)}
                          onBook={handleBookItem}
                        />
                      ))}
                      {recommendations.flights.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Plane className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No flights match your preferences</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hotels */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Hotel className="h-6 w-6 text-primary" />
                      <h3 className="text-2xl font-bold">Hotels</h3>
                      <Badge variant="secondary">{recommendations.hotels.length}</Badge>
                    </div>
                    <div className="space-y-4">
                      {recommendations.hotels.map((hotel) => (
                        <RecommendationCard
                          key={hotel.id}
                          item={hotel}
                          onView={() => handleViewItem(hotel)}
                          onBook={handleBookItem}
                        />
                      ))}
                      {recommendations.hotels.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Hotel className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No hotels match your preferences</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Packages */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="h-6 w-6 text-primary" />
                      <h3 className="text-2xl font-bold">Packages</h3>
                      <Badge variant="secondary">{recommendations.packages.length}</Badge>
                    </div>
                    <div className="space-y-4">
                      {recommendations.packages.map((pkg) => (
                        <RecommendationCard
                          key={pkg.id}
                          item={pkg}
                          onView={() => handleViewItem(pkg)}
                          onBook={handleBookItem}
                        />
                      ))}
                      {recommendations.packages.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No packages match your preferences</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-sm text-muted-foreground">Updating recommendations...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentPage === 'dashboard' && metrics && (
          <Dashboard
            metrics={metrics}
            onRefresh={loadMetrics}
            onReset={handleResetMetrics}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPanel
            users={users}
            currentUser={currentUser}
            onUserSelect={handleUserSelect}
            onUserUpdate={handleUserUpdate}
            onResetMetrics={handleResetMetrics}
          />
        )}
      </main>

      {/* Item Modal */}
      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBook={handleBookItem}
      />
    </div>
  );
};

export default Index;
