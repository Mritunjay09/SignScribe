
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SignDictionary } from "@/components/SignDictionary";

const Dictionary = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-dark mb-4">
                Sign Language <span className="text-purple">Dictionary</span>
              </h1>
              <p className="text-lg text-slate mb-6">
                Browse our comprehensive collection of sign language gestures. Search by category, 
                difficulty level, or specific terms to find exactly what you need.
              </p>
            </div>
          </div>
        </section>
        
        {/* Dictionary Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <SignDictionary />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dictionary;
