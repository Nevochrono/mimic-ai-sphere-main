
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MessageSquare, User, LogOut, Settings, Users, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Character {
  id: string;
  name: string;
  avatar?: string;
  status: 'ready' | 'training' | 'failed';
}

interface SidebarProps {
  characters: Character[];
  currentCharacterId?: string;
}

const Sidebar = ({ characters, currentCharacterId }: SidebarProps) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Avatar className="transition-transform duration-200 hover:scale-105">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground font-medium text-sm truncate">{user.email}</p>
            <p className="text-sidebar-foreground/60 text-xs">Online</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-1">
        <Link to="/dashboard">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200">
            <Home className="h-4 w-4 mr-3" />
            Dashboard
          </Button>
        </Link>
        <Link to="/profile">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200">
            <User className="h-4 w-4 mr-3" />
            Profile
          </Button>
        </Link>
        <Link to="/chat-rooms">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200">
            <Users className="h-4 w-4 mr-3" />
            Chat Rooms
          </Button>
        </Link>
      </div>

      {/* Create New Character Button */}
      <div className="px-4 pb-4">
        <Link to="/create-character">
          <Button className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-all duration-200 hover-scale">
            <Plus className="h-4 w-4 mr-2" />
            Create New Character
          </Button>
        </Link>
      </div>

      {/* Characters List */}
      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="text-sidebar-foreground text-sm font-medium mb-3">Your Characters</h3>
        <div className="space-y-2">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 animate-slide-up ${
                currentCharacterId === character.id
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Link
                to={`/chat/${character.id}`}
                className="flex items-center space-x-3 flex-1 min-w-0"
              >
                <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-105">
                  <AvatarImage src={character.avatar} />
                  <AvatarFallback className={`text-xs ${
                    currentCharacterId === character.id ? 'bg-sidebar-primary-foreground text-sidebar-primary' : 'bg-sidebar-accent text-sidebar-accent-foreground'
                  }`}>
                    {character.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{character.name}</p>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        character.status === 'ready'
                          ? 'bg-green-500'
                          : character.status === 'training'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <span className="text-xs opacity-70 capitalize">
                      {character.status}
                    </span>
                  </div>
                </div>
              </Link>
              <Link to={`/manage/${character.id}`}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`transition-all duration-200 ${
                    currentCharacterId === character.id 
                      ? 'text-sidebar-primary-foreground hover:bg-sidebar-primary-foreground hover:text-sidebar-primary' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
