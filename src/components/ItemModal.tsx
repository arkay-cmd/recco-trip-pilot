import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, CreditCard } from "lucide-react";
import { TravelItem } from "@/utils/mockApi";

interface ItemModalProps {
  item: (TravelItem & { score: number; reasons: string[] }) | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
}

export function ItemModal({ item, isOpen, onClose, onBook }: ItemModalProps) {
  if (!item) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleBook = () => {
    onBook();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
          <DialogDescription>
            Complete details and booking information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Image Placeholder */}
          <div className="h-64 bg-gradient-to-br from-sky via-ocean-light to-ocean rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Star className="h-5 w-5 fill-white" />
                  <span className="font-semibold">{item.rating}/5</span>
                </div>
                <div className="text-white text-right">
                  <div className="text-3xl font-bold">{formatPrice(item.price)}</div>
                  <div className="text-sm opacity-90">per person</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="capitalize">
                {tag.replace('-', ' ')}
              </Badge>
            ))}
          </div>

          {/* Why Recommended */}
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <h3 className="font-semibold text-primary mb-2">Why we recommend this:</h3>
            <ul className="space-y-1">
              {item.reasons.map((reason, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Details */}
          {item.details && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Details</h3>
                {Object.entries(item.details).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    {key === 'location' && <MapPin className="h-4 w-4 text-muted-foreground" />}
                    {key === 'duration' && <Clock className="h-4 w-4 text-muted-foreground" />}
                    {key === 'airline' && <Users className="h-4 w-4 text-muted-foreground" />}
                    <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span>{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulated Reviews */}
          <div className="space-y-3">
            <h3 className="font-semibold">Recent Reviews</h3>
            <div className="space-y-3">
              {[
                { name: "Priya S.", rating: 5, comment: "Amazing experience! Highly recommended." },
                { name: "Raj K.", rating: 4, comment: "Great value for money. Would book again." },
                { name: "Meera P.", rating: 5, comment: "Perfect for our family vacation." }
              ].map((review, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{review.name}</span>
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-sunset text-sunset" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button variant="booking" onClick={handleBook} className="flex-1" size="lg">
              <CreditCard className="h-5 w-5 mr-2" />
              Book for {formatPrice(item.price)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}