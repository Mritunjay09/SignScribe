
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CameraInterface } from "@/components/CameraInterface";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Camera, 
  MessageSquare, 
  Volume2, 
  List, 
  BookOpen, 
  CheckCircle,
  Lightbulb,
  AlertCircle
} from "lucide-react";

// Mock data for practice exercises
const practiceExercises = [
  {
    id: 1,
    name: "Basic Greetings",
    description: "Practice common greeting signs",
    signs: ["Hello", "Good morning", "How are you", "Nice to meet you"],
    completed: true
  },
  {
    id: 2,
    name: "Numbers 1-10",
    description: "Practice signing numbers from 1 to 10",
    signs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    completed: true
  },
  {
    id: 3,
    name: "Basic Questions",
    description: "Practice asking common questions",
    signs: ["What", "When", "Where", "Why", "How"],
    completed: false
  },
  {
    id: 4,
    name: "Colors",
    description: "Learn to sign different colors",
    signs: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange"],
    completed: false
  }
];

const Practice = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-dark mb-4">
                Practice <span className="text-purple">Sign Language</span>
              </h1>
              <p className="text-lg text-slate mb-6">
                Perfect your signing skills with our interactive practice modes.
                Get real-time feedback and track your progress.
              </p>
            </div>
          </div>
        </section>
        
        {/* Practice Area */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="camera" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="camera" className="data-[state=active]:bg-purple data-[state=active]:text-white">
                  <Camera className="mr-2 h-4 w-4" />
                  Camera
                </TabsTrigger>
                <TabsTrigger value="text-to-sign" className="data-[state=active]:bg-purple data-[state=active]:text-white">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Text to Sign
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="data-[state=active]:bg-purple data-[state=active]:text-white">
                  <List className="mr-2 h-4 w-4" />
                  Flashcards
                </TabsTrigger>
                <TabsTrigger value="exercises" className="data-[state=active]:bg-purple data-[state=active]:text-white">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Exercises
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="camera" className="mt-0">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-slate-dark mb-6 text-center">
                    Camera Practice Mode
                  </h2>
                  
                  <div className="max-w-2xl mx-auto">
                    <Card className="mb-6">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="bg-purple-50 p-3 rounded-full mr-4">
                            <Lightbulb className="h-6 w-6 text-purple" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-dark mb-1">Practice Instructions</h3>
                            <p className="text-slate text-sm">
                              Position yourself in front of the camera and practice any sign. 
                              The system will recognize your gestures and provide feedback.
                              Try to sign clearly and maintain good lighting for best results.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="mb-8">
                      <CameraInterface />
                    </div>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="bg-yellow-50 p-3 rounded-full mr-4">
                            <AlertCircle className="h-6 w-6 text-yellow-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-dark mb-1">Signing Tips</h3>
                            <ul className="text-slate text-sm list-disc ml-4 space-y-1">
                              <li>Keep your hands within the camera frame</li>
                              <li>Sign at a moderate pace for better recognition</li>
                              <li>Ensure good lighting for accurate detection</li>
                              <li>Position yourself about 2-3 feet from the camera</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="text-to-sign" className="mt-0">
                <div className="bg-slate-50 rounded-lg p-6 text-center">
                  <h2 className="text-2xl font-bold text-slate-dark mb-4">
                    Text to Sign Translation
                  </h2>
                  <p className="text-slate mb-8 max-w-2xl mx-auto">
                    Type any text and see it translated into sign language through our animated demonstrations.
                  </p>
                  
                  <div className="max-w-2xl mx-auto">
                    <div className="flex flex-col space-y-4 mb-8">
                      <textarea 
                        placeholder="Type your text here..." 
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple resize-none h-32"
                      />
                      <Button className="bg-purple hover:bg-purple-dark">
                        Translate to Sign Language
                      </Button>
                    </div>
                    
                    <div className="bg-white rounded-lg p-6 border border-slate-200 mb-6">
                      <div className="text-center mb-4">
                        <p className="text-sm text-slate-400">Sign Animation</p>
                        <div className="w-full aspect-video bg-slate-100 flex items-center justify-center my-4">
                          <img 
                            src="/placeholder.svg" 
                            alt="Sign animation placeholder" 
                            className="max-h-full"
                            style={{ filter: "hue-rotate(220deg)" }}
                          />
                        </div>
                        <p className="text-sm font-medium">Current word: <span className="text-purple">Hello</span></p>
                      </div>
                      
                      <div className="flex justify-center space-x-4">
                        <Button variant="outline" size="sm">
                          <Volume2 className="mr-2 h-4 w-4" />
                          Speech
                        </Button>
                        <Button variant="outline" size="sm">
                          Slower
                        </Button>
                        <Button variant="outline" size="sm">
                          Repeat
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="flashcards" className="mt-0">
                <div className="bg-slate-50 rounded-lg p-6 text-center">
                  <h2 className="text-2xl font-bold text-slate-dark mb-4">
                    Sign Language Flashcards
                  </h2>
                  <p className="text-slate mb-8 max-w-2xl mx-auto">
                    Test your knowledge and memory with our interactive flashcards.
                  </p>
                  
                  <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 mb-8 aspect-[4/3] flex items-center justify-center p-6 relative">
                      <div className="text-center">
                        <div className="mb-6">
                          <img 
                            src="/placeholder.svg" 
                            alt="Sign for Hello" 
                            className="h-48 mx-auto"
                            style={{ filter: "hue-rotate(220deg)" }}
                          />
                        </div>
                        <Button className="bg-purple hover:bg-purple-dark">
                          Reveal Answer
                        </Button>
                      </div>
                      <div className="absolute top-4 right-4 bg-slate-100 px-2 py-1 rounded text-sm text-slate-500">
                        1/10
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline">Previous</Button>
                      <Button className="bg-purple hover:bg-purple-dark">Next</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="exercises" className="mt-0">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-slate-dark mb-6 text-center">
                    Practice Exercises
                  </h2>
                  
                  <div className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {practiceExercises.map((exercise) => (
                        <Card key={exercise.id} className={exercise.completed ? "border-l-4 border-l-green-500" : ""}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-lg text-slate-dark">{exercise.name}</h3>
                              {exercise.completed && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                            <p className="text-slate text-sm mb-3">{exercise.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {exercise.signs.slice(0, 3).map((sign, index) => (
                                <span key={index} className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600">
                                  {sign}
                                </span>
                              ))}
                              {exercise.signs.length > 3 && (
                                <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600">
                                  +{exercise.signs.length - 3} more
                                </span>
                              )}
                            </div>
                            <Button className={`w-full ${exercise.completed ? 'bg-teal hover:bg-teal-dark' : 'bg-purple hover:bg-purple-dark'}`}>
                              {exercise.completed ? "Practice Again" : "Start Practice"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <Button variant="outline" className="border-purple text-purple">
                        Browse All Exercises
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Practice;
