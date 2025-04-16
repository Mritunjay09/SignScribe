
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import handGesture from "/hand-gesture.svg";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-purple-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-dark leading-tight mb-4">
              Learn Sign Language <br/> 
              <span className="text-purple">with Real-Time Feedback</span>
            </h1>
            <p className="text-lg md:text-xl text-slate mb-8 max-w-lg">
              Master sign language through interactive tutorials, real-time gesture recognition, 
              and instant translation—all in one app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-purple hover:bg-purple-dark text-white font-medium px-6 py-6 h-auto text-lg">
                Start Learning
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-purple text-purple hover:bg-purple-50 font-medium px-6 py-6 h-auto text-lg">
                Explore Features
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-teal rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-coral rounded-full opacity-20 blur-xl"></div>
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 relative z-10">
                <div className="bg-purple-50 rounded-lg p-4 mb-4 flex justify-center">
                  <img 
                    src="/placeholder.svg" 
                    alt="Hand gesture recognition" 
                    className="w-full max-w-sm"
                    style={{ filter: "hue-rotate(220deg)" }}
                  />
                </div>
                <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Recognized Sign</p>
                    <p className="text-xl font-medium text-slate-dark">Hello</p>
                  </div>
                  <div className="bg-purple text-white p-3 rounded-full">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
