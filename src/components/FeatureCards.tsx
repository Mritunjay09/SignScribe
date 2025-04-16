
import { 
  Book, 
  Camera, 
  Type, 
  MessageSquare, 
  BarChart, 
  BookOpen, 
  CalendarCheck, 
  Gamepad2, 
  Users, 
  Settings, 
  Wifi 
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

function FeatureCard({ title, description, icon, color }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-dark mb-2">{title}</h3>
      <p className="text-slate">{description}</p>
    </div>
  );
}

export function FeatureCards() {
  const features = [
    {
      title: "Interactive Sign Tutorials",
      description: "Learn signs with step-by-step video instructions and interactive 3D models.",
      icon: <Book className="text-white" />,
      color: "bg-purple"
    },
    {
      title: "Real-Time Gesture Recognition",
      description: "Practice signs with your camera and get instant feedback on your form.",
      icon: <Camera className="text-white" />,
      color: "bg-teal"
    },
    {
      title: "Sign-to-Text Translation",
      description: "Translate your sign language gestures into text immediately.",
      icon: <Type className="text-white" />,
      color: "bg-coral"
    },
    {
      title: "Text-to-Sign Translation",
      description: "Input text and see corresponding signs demonstrated by avatars.",
      icon: <MessageSquare className="text-white" />,
      color: "bg-purple-light"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed statistics and mastery levels.",
      icon: <BarChart className="text-white" />,
      color: "bg-teal-light"
    },
    {
      title: "Sign Dictionary",
      description: "Comprehensive library of signs with search and filtering capabilities.",
      icon: <BookOpen className="text-white" />,
      color: "bg-coral-light"
    },
    {
      title: "Daily Challenges",
      description: "Build consistency with daily sign language exercises and streaks.",
      icon: <CalendarCheck className="text-white" />,
      color: "bg-purple-dark"
    },
    {
      title: "Quizzes & Mini-Games",
      description: "Reinforce learning with fun interactive games and quizzes.",
      icon: <Gamepad2 className="text-white" />,
      color: "bg-teal-dark"
    },
    {
      title: "Community Features",
      description: "Connect with other learners, share progress, and practice together.",
      icon: <Users className="text-white" />,
      color: "bg-coral-dark"
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-dark mb-4">
            Comprehensive Features for <span className="text-purple">Complete Learning</span>
          </h2>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            Our app provides everything you need to learn sign language effectively, 
            from beginner to advanced levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              title={feature.title} 
              description={feature.description} 
              icon={feature.icon} 
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
