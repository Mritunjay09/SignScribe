
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, CheckCircle, BookOpen, Clock, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data for tutorials
const tutorials = [
  {
    id: 1,
    title: "Basics of Sign Language",
    description: "Learn the fundamental hand shapes and movements in sign language.",
    level: "Beginner",
    duration: "30 min",
    lessons: 8,
    progress: 75,
    imagePath: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Common Greetings",
    description: "Master everyday greetings and introductions in sign language.",
    level: "Beginner",
    duration: "20 min",
    lessons: 6,
    progress: 50,
    imagePath: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Numbers and Counting",
    description: "Learn to sign numbers and basic counting sequences.",
    level: "Beginner",
    duration: "25 min",
    lessons: 7,
    progress: 30,
    imagePath: "/placeholder.svg"
  },
  {
    id: 4,
    title: "Family and Relationships",
    description: "Signs for family members and describing relationships.",
    level: "Intermediate",
    duration: "45 min",
    lessons: 12,
    progress: 0,
    imagePath: "/placeholder.svg"
  },
  {
    id: 5,
    title: "Emotions and Feelings",
    description: "Express a wide range of emotions and feelings in sign language.",
    level: "Intermediate",
    duration: "35 min",
    lessons: 10,
    progress: 0,
    imagePath: "/placeholder.svg"
  },
  {
    id: 6,
    title: "Conversations in ASL",
    description: "Learn to have fluid conversations using American Sign Language.",
    level: "Advanced",
    duration: "60 min",
    lessons: 15,
    progress: 0,
    imagePath: "/placeholder.svg"
  },
];

const TutorialCard = ({ tutorial }) => {
  const { id, title, description, level, duration, lessons, progress, imagePath } = tutorial;
  
  let levelColor = "bg-green-100 text-green-700";
  if (level === "Intermediate") {
    levelColor = "bg-yellow-100 text-yellow-700";
  } else if (level === "Advanced") {
    levelColor = "bg-red-100 text-red-700";
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={imagePath} 
            alt={title}
            className="w-full h-48 object-cover"
            style={{ filter: "hue-rotate(220deg)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/70 flex items-end">
            <div className="p-4 text-white">
              <span className={`text-xs px-2 py-1 rounded-full ${levelColor} mb-2 inline-block`}>
                {level}
              </span>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
          </div>
          {progress > 0 && (
            <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-1">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <p className="text-slate mb-4">{description}</p>
          
          <div className="flex justify-between items-center text-sm text-slate-400 mb-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{lessons} lessons</span>
            </div>
          </div>
          
          {progress > 0 ? (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Progress</span>
                <span className="font-medium text-slate-dark">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : null}
          
          <Button className={progress > 0 ? "bg-teal hover:bg-teal-dark w-full" : "bg-purple hover:bg-purple-dark w-full"}>
            {progress > 0 ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Continue
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Start Tutorial
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Tutorials = () => {
  // Group tutorials by level
  const beginnerTutorials = tutorials.filter(tutorial => tutorial.level === "Beginner");
  const intermediateTutorials = tutorials.filter(tutorial => tutorial.level === "Intermediate");
  const advancedTutorials = tutorials.filter(tutorial => tutorial.level === "Advanced");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-dark mb-4">
                Interactive <span className="text-purple">Sign Language Tutorials</span>
              </h1>
              <p className="text-lg text-slate mb-6">
                Learn sign language with our structured, step-by-step tutorials.
                Progress at your own pace and track your learning journey.
              </p>
              <div className="flex items-center">
                <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
                  <div className="mr-4">
                    <div className="text-purple font-bold text-2xl">3</div>
                    <div className="text-slate-400 text-sm">In Progress</div>
                  </div>
                  <div className="w-px h-10 bg-slate-200 mx-4"></div>
                  <div className="mr-4">
                    <div className="text-slate-dark font-bold text-2xl">58%</div>
                    <div className="text-slate-400 text-sm">Completion</div>
                  </div>
                  <div className="w-px h-10 bg-slate-200 mx-4"></div>
                  <div>
                    <div className="text-slate-dark font-bold text-2xl">26</div>
                    <div className="text-slate-400 text-sm">Total Lessons</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Beginner Tutorials Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-dark">Beginner Tutorials</h2>
              <Button variant="ghost" className="text-purple">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beginnerTutorials.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Intermediate Tutorials Section */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-dark">Intermediate Tutorials</h2>
              <Button variant="ghost" className="text-purple">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {intermediateTutorials.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Advanced Tutorials Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-dark">Advanced Tutorials</h2>
              <Button variant="ghost" className="text-purple">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advancedTutorials.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tutorials;
