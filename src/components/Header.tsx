import { Button } from "@/components/ui/button";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
            to="/chat"
            className={({ isActive }) =>
              isActive
                ? "text-purple font-medium"
                : "text-slate hover:text-purple transition-colors"
            }
          >
            Video Chat
          </NavLink>
          <NavLink
            to="/practice"
            className={({ isActive }) =>
              isActive
                ? "text-purple font-medium"
                : "text-slate hover:text-purple transition-colors"
            }
          >
            Practice
          </NavLink>
          <NavLink
            to="/dictionary"
            className={({ isActive }) =>
              isActive
                ? "text-purple font-medium"
                : "text-slate hover:text-purple transition-colors"
            }
          >
            Dictionary
          </NavLink>
          <NavLink
            to="/community"
            className={({ isActive }) =>
              isActive
                ? "text-purple font-medium"
                : "text-slate hover:text-purple transition-colors"
            }
          >
            Community
          </NavLink>
        </nav>

        {/* Desktop Profile/Login Button */}
        <div className="hidden md:block">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-100 select-none text-fg-primary hover:bg-button-ghost-hover h-10 w-10 p-1 rounded-full"
                  type="button"
                  aria-haspopup="menu"
                >
                  <Avatar className="h-8 w-8 border border-border hover:opacity-75 duration-150">
                    <AvatarImage
                      src={
                        user.profilePicture ||
                        "https://assets.grok.com/users/f13bcf82-ff92-4abf-80db-3f5f26352a2b/R6UrEZ5RZCLslkfw-profile-picture.webp"
                      }
                      alt="Profile picture"
                      className="aspect-square h-full w-full"
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              className="bg-purple hover:bg-purple-dark"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
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
              to="/chat"
              className={({ isActive }) =>
                isActive
                  ? "text-purple font-medium"
                  : "text-slate hover:text-purple transition-colors"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Video Chat
            </NavLink>
            <NavLink
              to="/practice"
              className={({ isActive }) =>
                isActive
                  ? "text-purple font-medium"
                  : "text-slate hover:text-purple transition-colors"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Practice
            </NavLink>
            <NavLink
              to="/dictionary"
              className={({ isActive }) =>
                isActive
                  ? "text-purple font-medium"
                  : "text-slate hover:text-purple transition-colors"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Dictionary
            </NavLink>
            <NavLink
              to="/community"
              className={({ isActive }) =>
                isActive
                  ? "text-purple font-medium"
                  : "text-slate hover:text-purple transition-colors"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </NavLink>
            {isAuthenticated && user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive
                      ? "text-purple font-medium"
                      : "text-slate hover:text-purple transition-colors"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive
                      ? "text-purple font-medium"
                      : "text-slate hover:text-purple transition-colors"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </NavLink>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    await handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                className="bg-purple hover:bg-purple-dark w-full"
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}