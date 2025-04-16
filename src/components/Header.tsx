
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-dark to-purple-light bg-clip-text text-transparent">
              SignScribe
            </span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <NavLink 
            to="/tutorials" 
            className={({ isActive }) => 
              isActive ? "text-purple font-medium" : "text-slate hover:text-purple transition-colors"
            }
          >
            Tutorials
          </NavLink>
          <NavLink 
            to="/practice" 
            className={({ isActive }) => 
              isActive ? "text-purple font-medium" : "text-slate hover:text-purple transition-colors"
            }
          >
            Practice
          </NavLink>
          <NavLink 
            to="/dictionary" 
            className={({ isActive }) => 
              isActive ? "text-purple font-medium" : "text-slate hover:text-purple transition-colors"
            }
          >
            Dictionary
          </NavLink>
          <NavLink 
            to="/community" 
            className={({ isActive }) => 
              isActive ? "text-purple font-medium" : "text-slate hover:text-purple transition-colors"
            }
          >
            Community
          </NavLink>
        </nav>

        <div className="hidden md:block">
          <Button className="bg-purple hover:bg-purple-dark">Get Started</Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          className="md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu />
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute w-full border-b border-slate-100 shadow-md z-50">
          <div className="flex flex-col p-4 space-y-4">
            <NavLink 
              to="/tutorials" 
              className={({ isActive }) => 
                isActive ? "text-purple font-medium" : "text-slate hover:text-purple transition-colors"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Tutorials
            </NavLink>
            <NavLink 
              to="/practice" 
              className={({ isActive }) => 
                isActive ? "text-purple font-medium" : "text-slate hover:text-purple transition-colors"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Practice
            </NavLink>
            <NavLink 
              to="/dictionary" 
              className={({ isActive }) => 
                isActive ? "text-purple font-medium" : "text-slate hover:text-purple transition-colors"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Dictionary
            </NavLink>
            <NavLink 
              to="/community" 
              className={({ isActive }) => 
                isActive ? "text-purple font-medium" : "text-slate hover:text-purple transition-colors"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </NavLink>
            <Button className="bg-purple hover:bg-purple-dark w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
