
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { FeatureCards } from "@/components/FeatureCards";
import { CameraInterface } from "@/components/CameraInterface";
import { SignDictionary } from "@/components/SignDictionary";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <FeatureCards />
        
        {/* Camera Demo Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-dark mb-4">
                Real-Time <span className="text-purple">Gesture Recognition</span>
              </h2>
              <p className="text-lg text-slate max-w-2xl mx-auto">
                Practice your signs with our advanced camera recognition technology
                and receive instant feedback on your form.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <CameraInterface />
            </div>
          </div>
        </section>
        
        {/* Sign Dictionary Preview Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-dark mb-4">
                Comprehensive <span className="text-purple">Sign Dictionary</span>
              </h2>
              <p className="text-lg text-slate max-w-2xl mx-auto">
                Browse our extensive library of signs with detailed demonstrations
                and learning resources.
              </p>
            </div>
            
            <div className="mb-8">
              <SignDictionary />
            </div>
            
            <div className="text-center mt-12">
              <Button className="bg-purple hover:bg-purple-dark">
                Explore Full Dictionary
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-purple to-purple-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your Sign Language Journey Today
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of learners mastering sign language with our 
              interactive and personalized learning platform.
            </p>
            <Button className="bg-white text-purple hover:bg-slate-100 text-lg px-8 py-6 h-auto">
              Get Started Free
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
