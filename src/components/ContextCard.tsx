import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Palmtree, DollarSign, Tags } from "lucide-react";

interface ContextCardProps {
  onContextChange: (context: {
    purpose?: string;
    budgetLevel?: string;
    selectedTags?: string[];
  }) => void;
  initialContext?: {
    purpose?: string;
    budgetLevel?: string;
    selectedTags?: string[];
  };
}

const POPULAR_TAGS = [
  "beach", "city", "luxury", "family", "business", "resort", "cultural", 
  "adventure", "relax", "food", "shopping", "nature", "heritage", "spa"
];

const BUDGET_LABELS = {
  0: { level: "low", label: "Budget", range: "₹5K - ₹15K" },
  1: { level: "mid", label: "Moderate", range: "₹15K - ₹50K" },
  2: { level: "high", label: "Luxury", range: "₹50K+" }
};

export function ContextCard({ onContextChange, initialContext }: ContextCardProps) {
  const [purpose, setPurpose] = useState(initialContext?.purpose || "");
  const [budgetLevel, setBudgetLevel] = useState(() => {
    const level = initialContext?.budgetLevel || "mid";
    return level === "low" ? [0] : level === "mid" ? [1] : [2];
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(initialContext?.selectedTags || []);

  const handlePurposeChange = (newPurpose: string) => {
    setPurpose(newPurpose);
    onContextChange({
      purpose: newPurpose,
      budgetLevel: BUDGET_LABELS[budgetLevel[0]].level,
      selectedTags
    });
  };

  const handleBudgetChange = (value: number[]) => {
    setBudgetLevel(value);
    onContextChange({
      purpose,
      budgetLevel: BUDGET_LABELS[value[0]].level,
      selectedTags
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onContextChange({
      purpose,
      budgetLevel: BUDGET_LABELS[budgetLevel[0]].level,
      selectedTags: newTags
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-card border-0 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Tags className="h-5 w-5 text-primary" />
          Tell us about your trip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trip Purpose */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Trip Purpose
          </label>
          <div className="flex gap-3">
            <Button
              variant={purpose === "business" ? "ocean" : "outline"}
              onClick={() => handlePurposeChange("business")}
              className="flex-1"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Business
            </Button>
            <Button
              variant={purpose === "leisure" ? "sunset" : "outline"}
              onClick={() => handlePurposeChange("leisure")}
              className="flex-1"
            >
              <Palmtree className="h-4 w-4 mr-2" />
              Leisure
            </Button>
          </div>
        </div>

        {/* Budget Level */}
        <div className="space-y-4">
          <label className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Budget Range
          </label>
          <div className="px-4">
            <Slider
              value={budgetLevel}
              onValueChange={handleBudgetChange}
              max={2}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Budget</span>
              <span>Moderate</span>
              <span>Luxury</span>
            </div>
            <div className="text-center mt-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {BUDGET_LABELS[budgetLevel[0]].label}: {BUDGET_LABELS[budgetLevel[0]].range}
              </Badge>
            </div>
          </div>
        </div>

        {/* Interest Tags */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            What interests you? (Select multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedTags.includes(tag) 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-primary/10"
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Selected: {selectedTags.join(", ")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}