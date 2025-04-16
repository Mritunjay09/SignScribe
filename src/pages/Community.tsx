
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, MessageSquare, Video, Calendar, Award } from "lucide-react";

const Community = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-dark mb-4">
                Sign Language <span className="text-purple">Community</span>
              </h1>
              <p className="text-lg text-slate mb-6">
                Connect with other sign language learners, share your progress, and practice together.
              </p>
              <Button className="bg-purple hover:bg-purple-dark">
                <UserPlus className="mr-2 h-4 w-4" />
                Join Community
              </Button>
            </div>
          </div>
        </section>
        
        {/* Community Features */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-dark mb-8 text-center">
              Connect and Learn Together
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="bg-purple/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-purple" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-dark mb-2">Practice Partners</h3>
                  <p className="text-slate mb-4">
                    Find practice partners who match your skill level and learning goals.
                  </p>
                  <Button variant="outline" className="w-full border-purple text-purple">
                    Find Partners
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="bg-teal/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Video className="h-6 w-6 text-teal" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-dark mb-2">Live Sessions</h3>
                  <p className="text-slate mb-4">
                    Join live practice sessions led by experienced sign language users.
                  </p>
                  <Button variant="outline" className="w-full border-teal text-teal">
                    Browse Sessions
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="bg-coral/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-coral" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-dark mb-2">Discussion Forums</h3>
                  <p className="text-slate mb-4">
                    Ask questions, share tips, and discuss sign language topics with the community.
                  </p>
                  <Button variant="outline" className="w-full border-coral text-coral">
                    Join Discussions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Coming Soon */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-dark mb-4">
              Coming Soon
            </h2>
            <p className="text-slate mb-8 max-w-2xl mx-auto">
              We're working on exciting new community features to enhance your learning experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                <Calendar className="h-8 w-8 text-purple mx-auto mb-3" />
                <h3 className="font-bold text-slate-dark mb-2">Community Events</h3>
                <p className="text-slate text-sm">
                  Virtual meetups and practice events scheduled regularly.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                <Award className="h-8 w-8 text-teal mx-auto mb-3" />
                <h3 className="font-bold text-slate-dark mb-2">Achievements</h3>
                <p className="text-slate text-sm">
                  Earn badges and recognition for your progress and contributions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                <Video className="h-8 w-8 text-coral mx-auto mb-3" />
                <h3 className="font-bold text-slate-dark mb-2">Video Submissions</h3>
                <p className="text-slate text-sm">
                  Submit videos of your signing for feedback from the community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Community;
