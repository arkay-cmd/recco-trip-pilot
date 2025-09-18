import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Users, RotateCcw, Save } from "lucide-react";
import { User } from "@/utils/mockApi";

interface AdminPanelProps {
  users: User[];
  currentUser: User | null;
  onUserSelect: (userId: string) => void;
  onUserUpdate: (userId: string, updates: Partial<User>) => void;
  onResetMetrics: () => void;
}

const BUDGET_OPTIONS = [
  { value: "low", label: "Budget (₹5K - ₹15K)" },
  { value: "mid", label: "Moderate (₹15K - ₹50K)" },
  { value: "high", label: "Luxury (₹50K+)" }
];

const AVAILABLE_TAGS = [
  "beach", "city", "luxury", "family", "business", "resort", "cultural",
  "adventure", "relax", "food", "shopping", "nature", "heritage", "spa",
  "tropical", "convenient", "downtown", "peaceful", "trending"
];

export function AdminPanel({ 
  users, 
  currentUser, 
  onUserSelect, 
  onUserUpdate, 
  onResetMetrics 
}: AdminPanelProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [tempPreferences, setTempPreferences] = useState<any>(null);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setTempPreferences({ ...user.preferences });
  };

  const handleSaveUser = () => {
    if (editingUser && tempPreferences) {
      onUserUpdate(editingUser.id, {
        preferences: tempPreferences
      });
      setEditingUser(null);
      setTempPreferences(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setTempPreferences(null);
  };

  const handlePurposeChange = (purpose: string) => {
    setTempPreferences((prev: any) => ({
      ...prev,
      purpose: purpose
    }));
  };

  const handleBudgetChange = (budget: string) => {
    setTempPreferences((prev: any) => ({
      ...prev,
      budgetLevel: budget
    }));
  };

  const handleTagToggle = (tag: string) => {
    setTempPreferences((prev: any) => ({
      ...prev,
      preferredTags: prev.preferredTags.includes(tag)
        ? prev.preferredTags.filter((t: string) => t !== tag)
        : [...prev.preferredTags, tag]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Manage user profiles and test personalization</p>
        </div>
        <Button variant="destructive" onClick={onResetMetrics}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All Metrics
        </Button>
      </div>

      {/* Current User Selector */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={currentUser?.id || ""} onValueChange={onUserSelect}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select active user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {currentUser && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">{currentUser.preferences.purpose || 'No purpose'}</Badge>
                <Badge variant="secondary">{currentUser.preferences.budgetLevel}</Badge>
                <Badge className="bg-primary/10 text-primary">
                  {currentUser.preferences.preferredTags.length} interests
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User List */}
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader>
            <CardTitle>User Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 rounded-lg border transition-all ${
                    currentUser?.id === user.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUserSelect(user.id)}
                      >
                        Select
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Purpose:</span>
                      <Badge variant="outline" className="text-xs">
                        {user.preferences.purpose || 'Not set'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Budget:</span>
                      <Badge variant="secondary" className="text-xs">
                        {user.preferences.budgetLevel}
                      </Badge>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-muted-foreground">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {user.preferences.preferredTags.length > 0 ? (
                          user.preferences.preferredTags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None</span>
                        )}
                        {user.preferences.preferredTags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.preferences.preferredTags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">History:</span>
                      <Badge className="text-xs bg-muted text-muted-foreground">
                        {user.history.length} trips
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit User */}
        {editingUser && (
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle>Edit User: {editingUser.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trip Purpose */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Trip Purpose</label>
                <div className="flex gap-2">
                  <Button
                    variant={tempPreferences?.purpose === "business" ? "ocean" : "outline"}
                    size="sm"
                    onClick={() => handlePurposeChange("business")}
                  >
                    Business
                  </Button>
                  <Button
                    variant={tempPreferences?.purpose === "leisure" ? "sunset" : "outline"}
                    size="sm"
                    onClick={() => handlePurposeChange("leisure")}
                  >
                    Leisure
                  </Button>
                  <Button
                    variant={tempPreferences?.purpose === null ? "ghost" : "outline"}
                    size="sm"
                    onClick={() => handlePurposeChange("")}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Budget Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Level</label>
                <Select
                  value={tempPreferences?.budgetLevel || ""}
                  onValueChange={handleBudgetChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget level" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preferred Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Tags</label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {AVAILABLE_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={tempPreferences?.preferredTags?.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Selected: {tempPreferences?.preferredTags?.length || 0} tags
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                  Cancel
                </Button>
                <Button variant="default" onClick={handleSaveUser} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Instructions */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle>How to Test Personalization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-semibold mt-0.5">1</div>
              <div>
                <strong>Select different users</strong> - Switch between "New Traveler" (cold start), "Sarah Johnson" (leisure), and "Michael Chen" (business) to see how recommendations change.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-semibold mt-0.5">2</div>
              <div>
                <strong>Edit user preferences</strong> - Click the settings icon next to any user to modify their preferences and see how it affects recommendations.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-semibold mt-0.5">3</div>
              <div>
                <strong>Search with different queries</strong> - Try searches like "beach family", "business luxury", or "cultural heritage" to see intent-based recommendations.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-semibold mt-0.5">4</div>
              <div>
                <strong>Monitor the dashboard</strong> - Track how different user profiles affect click-through rates and conversion rates.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}