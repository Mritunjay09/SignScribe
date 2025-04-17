import { useState } from "react";
import { Search, Filter, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

// Mock data for sign dictionary
const mockSigns = [
  { 
    id: 1, 
    name: "Hello", 
    category: "Greetings", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "The sign for 'Hello' is made by extending your hand with your palm facing forward, fingers pointing up, and moving your hand in an arc from the side of your head outward, as if you're waving.",
    steps: [
      "Face your palm outward, with fingers pointing up",
      "Keep your elbow at your side",
      "Move your hand in an arc away from your body",
      "Smile while making this gesture for added friendliness"
    ],
    tips: "Keep the movement relaxed and natural, like a traditional wave."
  },
  { 
    id: 2, 
    name: "Thank You", 
    category: "Courtesy", 
    difficulty: "Easy", 
    imagePath: "/placeholder.svg",
    description: "To sign 'Thank You', extend your flat hand with fingers together from your chin forward. It's like blowing a kiss from your chin or mouth.",
    steps: [
      "Touch your chin or lips with the fingertips of your flat hand",
      "Move your hand forward and slightly up",
      "End with your palm facing up",
      "Make sure to maintain eye contact"
    ],
    tips: "This is one of the most important signs to know for basic communication."
  },
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
  onLearnClick: () => void;
}

function SignCard({ name, category, difficulty, imagePath, onLearnClick }: SignCardProps) {
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
          <Button 
            variant="ghost" 
            className="w-full justify-between text-purple hover:text-purple-dark hover:bg-purple-50"
            onClick={onLearnClick}
          >
            Learn Sign
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface SignDetailProps {
  sign: {
    name: string;
    category: string;
    difficulty: string;
    imagePath: string;
    description?: string;
    steps?: string[];
    tips?: string;
  } | null;
}

function SignDetail({ sign }: SignDetailProps) {
  if (!sign) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-slate-50 p-6 rounded-lg flex items-center justify-center">
        <img 
          src={sign.imagePath} 
          alt={`Sign for ${sign.name}`} 
          className="w-full max-h-80 object-contain"
          style={{ filter: "hue-rotate(220deg)" }}
        />
      </div>
      
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold">{sign.name}</h2>
          <span className={`text-xs px-2 py-1 rounded-full ${
            sign.difficulty === "Easy" ? "bg-green-100 text-green-700" : 
            sign.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" : 
            "bg-red-100 text-red-700"
          }`}>
            {sign.difficulty}
          </span>
          <span className="text-sm text-slate-400">{sign.category}</span>
        </div>
        
        {sign.description && (
          <div className="mb-4">
            <p className="text-gray-700">{sign.description}</p>
          </div>
        )}
        
        {sign.steps && sign.steps.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Steps</h3>
            <ol className="list-decimal pl-5 space-y-1">
              {sign.steps.map((step, index) => (
                <li key={index} className="text-gray-700">{step}</li>
              ))}
            </ol>
          </div>
        )}
        
        {sign.tips && (
          <div className="mt-4 bg-purple-50 p-3 rounded-md">
            <h3 className="text-sm font-semibold text-purple mb-1">Tip</h3>
            <p className="text-sm text-gray-700">{sign.tips}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SignDictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const categories = ["All", "Greetings", "Courtesy", "Questions", "Relationships", "Emotions", "Common"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSign, setSelectedSign] = useState<typeof mockSigns[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter signs based on search and category
  const filteredSigns = mockSigns.filter(sign => {
    const matchesSearch = sign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || sign.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLearnClick = (sign: typeof mockSigns[0]) => {
    setSelectedSign(sign);
    setIsDialogOpen(true);
  };

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
            onLearnClick={() => handleLearnClick(sign)}
          />
        ))}
        
        {filteredSigns.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-slate-400">No signs found matching your search.</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Learn Sign</DialogTitle>
            <DialogDescription>
              Study the gesture and follow the instructions below.
            </DialogDescription>
          </DialogHeader>
          <SignDetail sign={selectedSign} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
