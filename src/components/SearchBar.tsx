import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "How are you feeling, traveller? (e.g., 'need some me time', 'feeling adventurous', 'want to chill')" }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Real-time search as user types
    if (e.target.value.length > 2) {
      onSearch(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 z-10">
          <MapPin className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-12 pr-20 py-6 text-lg bg-white border-2 border-primary/20 rounded-xl shadow-card focus:border-primary/50 focus:ring-primary/20"
        />
        <Button
          type="submit"
          variant="ocean"
          className="absolute right-2 rounded-lg px-6"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
}