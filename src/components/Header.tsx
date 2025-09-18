import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Plane, BarChart3, Settings } from "lucide-react";
import { User as UserType } from "@/utils/mockApi";

interface HeaderProps {
  users: UserType[];
  currentUser: UserType | null;
  onUserSelect: (userId: string) => void;
  onNavigate: (page: 'home' | 'dashboard' | 'admin') => void;
  currentPage: string;
}

export function Header({ users, currentUser, onUserSelect, onNavigate, currentPage }: HeaderProps) {
  return (
    <header className="bg-gradient-hero border-b shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-primary-foreground" />
              <h1 className="text-2xl font-bold text-primary-foreground">
                TravelAI
              </h1>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <Button 
              variant={currentPage === 'home' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('home')}
              className="text-primary-foreground hover:bg-white/20"
            >
              Home
            </Button>
            
            <Button 
              variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="text-primary-foreground hover:bg-white/20"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            
            <Button 
              variant={currentPage === 'admin' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('admin')}
              className="text-primary-foreground hover:bg-white/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>

            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-primary-foreground" />
              <Select value={currentUser?.id || ""} onValueChange={onUserSelect}>
                <SelectTrigger className="w-48 bg-white/20 border-white/30 text-primary-foreground">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}