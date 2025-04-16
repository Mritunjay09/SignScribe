
import { useState } from "react";
import { Search, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for sign dictionary
const mockSigns = [
  { id: 1, name: "Hello", category: "Greetings", difficulty: "Easy", imagePath: "/placeholder.svg" },
  { id: 2, name: "Thank You", category: "Courtesy", difficulty: "Easy", imagePath: "/placeholder.svg" },
  { id: 3, name: "Please", category: "Courtesy", difficulty: "Easy", imagePath: "/placeholder.svg" },
  { id: 4, name: "Sorry", category: "Courtesy", difficulty: "Medium", imagePath: "/placeholder.svg" },
  { id: 5, name: "Help", category: "Common", difficulty: "Medium", imagePath: "/placeholder.svg" },
  { id: 6, name: "Name", category: "Questions", difficulty: "Easy", imagePath: "/placeholder.svg" },
  { id: 7, name: "Where", category: "Questions", difficulty: "Medium", imagePath: "/placeholder.svg" },
  { id: 8, name: "When", category: "Questions", difficulty: "Medium", imagePath: "/placeholder.svg" },
  { id: 9, name: "Family", category: "Relationships", difficulty: "Hard", imagePath: "/placeholder.svg" },
  { id: 10, name: "Friend", category: "Relationships", difficulty: "Medium", imagePath: "/placeholder.svg" },
  { id: 11, name: "Love", category: "Emotions", difficulty: "Easy", imagePath: "/placeholder.svg" },
  { id: 12, name: "Happy", category: "Emotions", difficulty: "Easy", imagePath: "/placeholder.svg" },
];

interface SignCardProps {
  name: string;
  category: string;
  difficulty: string;
  imagePath: string;
}

function SignCard({ name, category, difficulty, imagePath }: SignCardProps) {
  let difficultyColor = "bg-green-100 text-green-700";
  if (difficulty === "Medium") {
    difficultyColor = "bg-yellow-100 text-yellow-700";
  } else if (difficulty === "Hard") {
    difficultyColor = "bg-red-100 text-red-700";
  }
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 bg-slate-50">
          <img 
            src={imagePath} 
            alt={`Sign for ${name}`} 
            className="w-full h-32 object-contain"
            style={{ filter: "hue-rotate(220deg)" }}
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-dark">{name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor}`}>
              {difficulty}
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-3">{category}</p>
          <Button variant="ghost" className="w-full justify-between text-purple hover:text-purple-dark hover:bg-purple-50">
            Learn Sign
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SignDictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const categories = ["All", "Greetings", "Courtesy", "Questions", "Relationships", "Emotions", "Common"];
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Filter signs based on search and category
  const filteredSigns = mockSigns.filter(sign => {
    const matchesSearch = sign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || sign.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search signs..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start mb-2 bg-transparent">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setActiveCategory(category)}
                className="data-[state=active]:bg-purple data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSigns.map(sign => (
          <SignCard 
            key={sign.id}
            name={sign.name}
            category={sign.category}
            difficulty={sign.difficulty}
            imagePath={sign.imagePath}
          />
        ))}
        
        {filteredSigns.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-slate-400">No signs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
