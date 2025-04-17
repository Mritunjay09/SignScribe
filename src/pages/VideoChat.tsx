
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideoChatInterface } from "@/components/VideoChatInterface";

const VideoChat = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-dark mb-4">
                Sign Language <span className="text-purple">Video Chat</span>
              </h1>
              <p className="text-lg text-slate mb-6">
                Connect with friends and practice sign language in real-time using our video chat feature.
                Perfect your skills through direct communication.
              </p>
            </div>
          </div>
        </section>
        
        {/* Video Chat Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <VideoChatInterface />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default VideoChat;
