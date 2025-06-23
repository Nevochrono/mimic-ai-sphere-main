
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Settings } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface Character {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  status: 'ready' | 'training' | 'failed';
  messages: number;
}

const Dashboard = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    // Load characters from localStorage or API
    const savedCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
    setCharacters(savedCharacters);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-600';
      case 'training': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar characters={characters} />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 gradient-text">Your Characters</h1>
            <p className="text-muted-foreground">Manage and chat with your AI characters</p>
          </div>

          {characters.length === 0 ? (
            <Card className="bg-card border-border text-center py-12 hover-scale animate-slide-up">
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">No characters yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first AI character to get started</p>
                    <Link to="/create-character">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover-scale">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Character
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character, index) => (
                <Card key={character.id} className="bg-card border-border hover:shadow-lg transition-all duration-200 hover-scale animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 transition-transform duration-200 hover:scale-105">
                        <AvatarImage src={character.avatar} />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {character.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-card-foreground text-lg">{character.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className={`${getStatusColor(character.status)} text-white text-xs`}>
                            {character.status}
                          </Badge>
                          <span className="text-muted-foreground text-sm">{character.messages} messages</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-4 line-clamp-3">
                      {character.description}
                    </CardDescription>
                    <div className="flex space-x-2">
                      <Link to={`/chat/${character.id}`} className="flex-1">
                        <Button 
                          variant="default" 
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                          disabled={character.status !== 'ready'}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </Link>
                      <Link to={`/manage/${character.id}`}>
                        <Button variant="outline" size="icon" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
