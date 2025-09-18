import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, CreditCard, Info } from "lucide-react";
import { TravelItem } from "@/utils/mockApi";

interface RecommendationCardProps {
  item: TravelItem & { score: number; reasons: string[] };
  onView: () => void;
  onBook: () => void;
}

export function RecommendationCard({ item, onView, onBook }: RecommendationCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0 overflow-hidden">
      <div className="relative">
        {/* Placeholder image area */}
        <div className="h-48 bg-gradient-to-br from-sky via-ocean-light to-ocean relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          {item.trending && (
            <Badge className="absolute top-3 left-3 bg-sunset text-white border-0">
              🔥 Trending
            </Badge>
          )}
          <Badge className="absolute top-3 right-3 bg-primary text-white border-0 font-semibold">
            Score: {item.score.toFixed(1)}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-sunset text-sunset" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>

            {/* Why recommended reasons */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Why recommended:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.reasons.slice(0, 2).map((reason, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onView}
                className="flex-1 group-hover:border-primary group-hover:text-primary"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button
                variant="booking"
                size="sm"
                onClick={onBook}
                className="flex-1"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}