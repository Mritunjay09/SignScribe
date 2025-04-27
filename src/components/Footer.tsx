import { Facebook, Instagram, Twitter, Youtube, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4">SignScribe</h2>
            <p className="text-slate-300 mb-6">
              Learn sign language with real-time feedback and interactive tutorials.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2">
              <li><Link to="/practice" className="text-slate-300 hover:text-white transition-colors">Gesture Recognition</Link></li>
              <li><Link to="/chat" className="text-slate-300 hover:text-white transition-colors">Translation</Link></li>
              <li><Link to="/dictionary" className="text-slate-300 hover:text-white transition-colors">Dictionary</Link></li>
              <li><Link to="/practice" className="text-slate-300 hover:text-white transition-colors">Games & Quizzes</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-slate-300 mb-4">
              Subscribe to our newsletter for tips, updates and news.
            </p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple bg-slate-700 text-white"
              />
              <Button className="bg-purple hover:bg-purple-dark w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
          <p>© {new Date().getFullYear()} SignScribe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
