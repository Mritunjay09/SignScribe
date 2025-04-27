
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Pencil, Save, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { fetchUserProfile, getUserFromToken, updateUserProfile, logout } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Fetch user profile on component mount
  useEffect(() => {
    const user = getUserFromToken();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setName(user.name || "");
    setBio(user.bio || "");
    setProfilePicture(user.profilePicture || null);
    
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const profileData = await fetchUserProfile();
        if (profileData) {
          setName(profileData.name || "");
          setBio(profileData.bio || "");
          setProfilePicture(profileData.profilePicture || null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio || '');
      
      if (fileInputRef.current?.files?.[0]) {
        formData.append('profilePicture', fileInputRef.current.files[0]);
      }
      
      const updatedProfile = await updateUserProfile(formData);
      if (updatedProfile) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow flex items-start justify-center p-8">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-purple">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile picture card */}
            <Card className="md:col-span-1">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profilePicture || undefined} />
                    <AvatarFallback className="text-2xl bg-purple text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <Button 
                        className="rounded-full w-8 h-8 p-0 bg-purple"
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                      >
                        <Camera size={16} />
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold mb-1">{name}</h2>
                
                <div className="w-full mt-6 space-y-3">
                  <Button 
                    className="w-full" 
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isLoading}
                  >
                    {isEditing ? "Cancel" : (
                      <>
                        <Pencil className="mr-2" size={16} />
                        Edit Profile
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Profile details card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  {isEditing ? "Update your profile information" : "Your personal information"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-dark mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        className="pl-10 w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing || isLoading}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-slate-dark mb-2">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself"
                      className="w-full min-h-[120px]"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                  
                  {isEditing && (
                    <Button 
                      className="w-full" 
                      type="submit"
                      disabled={isLoading}
                    >
                      <Save className="mr-2" size={16} />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
