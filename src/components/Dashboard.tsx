import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Eye, MousePointer, CreditCard, TrendingUp, RefreshCw } from "lucide-react";
import { Metrics } from "@/utils/mockApi";

interface DashboardProps {
  metrics: Metrics;
  onRefresh: () => void;
  onReset: () => void;
}

export function Dashboard({ metrics, onRefresh, onReset }: DashboardProps) {
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const eventTypeColors = {
    impression: "bg-blue-100 text-blue-700",
    click: "bg-green-100 text-green-700", 
    booking: "bg-orange-100 text-orange-700"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time metrics and user behavior insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="destructive" onClick={onReset}>
            Reset Metrics
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.impressions}</div>
            <p className="text-xs text-muted-foreground">
              Recommendations shown to users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.clicks}</div>
            <p className="text-xs text-muted-foreground">
              Items viewed in detail
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.bookings}</div>
            <p className="text-xs text-muted-foreground">
              Successful bookings completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatPercent(metrics.conversion)}</div>
            <p className="text-xs text-muted-foreground">
              Bookings per click
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Click-through Rate (CTR)</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {formatPercent(metrics.ctr)}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <Badge variant="secondary" className="bg-sunset/10 text-sunset">
                  {formatPercent(metrics.conversion)}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Events</span>
                <Badge variant="outline">
                  {metrics.events.length}
                </Badge>
              </div>
            </div>

            {/* Performance Interpretation */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Performance Insights</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                {metrics.ctr > 20 && <div className="text-green-600">✓ Excellent CTR - recommendations are highly relevant</div>}
                {metrics.ctr <= 20 && metrics.ctr > 10 && <div className="text-orange-600">→ Good CTR - room for improvement</div>}
                {metrics.ctr <= 10 && <div className="text-red-600">⚠ Low CTR - consider improving recommendation quality</div>}
                
                {metrics.conversion > 15 && <div className="text-green-600">✓ High conversion rate - users are engaged</div>}
                {metrics.conversion <= 15 && metrics.conversion > 5 && <div className="text-orange-600">→ Moderate conversion - optimize booking flow</div>}
                {metrics.conversion <= 5 && metrics.clicks > 0 && <div className="text-red-600">⚠ Low conversion - check pricing and booking experience</div>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {metrics.events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No events recorded yet</p>
                  <p className="text-sm">Start using the app to see analytics here</p>
                </div>
              ) : (
                metrics.events.slice().reverse().map((event, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <Badge className={eventTypeColors[event.eventType]} variant="secondary">
                        {event.eventType}
                      </Badge>
                      <div className="text-sm">
                        <div className="font-medium">{event.itemId}</div>
                        <div className="text-muted-foreground">User: {event.userId}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(event.timestamp)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}