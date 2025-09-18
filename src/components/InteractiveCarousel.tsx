import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Star, MapPin, Clock } from "lucide-react";
import { TravelItem } from "@/utils/mockApi";

interface InteractiveCarouselProps {
  items: Array<TravelItem & { score: number; reasons: string[] }>;
  onItemClick: (item: TravelItem & { score: number; reasons: string[] }) => void;
  title: string;
  subtitle?: string;
}

export function InteractiveCarousel({ items, onItemClick, title, subtitle }: InteractiveCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlay, items.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  if (!items.length) {
    return (
      <div className="w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No recommendations available at the moment</p>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Main Carousel */}
      <div className="relative group">
        <Card className="overflow-hidden bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300">
          <div className="relative">
            {/* Image Container */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={currentItem.imageUrl}
                alt={currentItem.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/800/400';
                }}
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Trending Badge */}
              {currentItem.trending && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-sunset text-white px-3 py-1">
                    🔥 Trending
                  </Badge>
                </div>
              )}

              {/* Score Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary/90 text-primary-foreground px-3 py-1">
                  Score: {currentItem.score.toFixed(1)}
                </Badge>
              </div>

              {/* Navigation Arrows */}
              {items.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={prevSlide}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={nextSlide}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>

            {/* Content */}
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{currentItem.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{currentItem.rating}</span>
                      </div>
                      {currentItem.details?.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{currentItem.details.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ₹{currentItem.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Reasons */}
                <div className="flex flex-wrap gap-2">
                  {currentItem.reasons.slice(0, 3).map((reason, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => onItemClick(currentItem)}
                  className="w-full bg-gradient-ocean hover:opacity-90 transition-opacity"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="flex justify-center space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-primary scale-110'
                  : 'bg-muted hover:bg-primary/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip */}
      {items.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-primary scale-105'
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/80/64';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}