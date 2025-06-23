
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Download, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";

interface Character {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  status: 'ready' | 'training' | 'failed';
  messages: number;
  createdAt: string;
}

const ManageCharacter = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const characters = JSON.parse(localStorage.getItem('characters') || '[]');

  useEffect(() => {
    const foundCharacter = characters.find((c: Character) => c.id === characterId);
    if (!foundCharacter) {
      navigate('/dashboard');
      return;
    }
    setCharacter(foundCharacter);
  }, [characterId, navigate]);

  const handleDeleteCharacter = async () => {
    if (!character) return;

    setIsDeleting(true);

    // Simulate deletion process
    setTimeout(() => {
      const updatedCharacters = characters.filter((c: Character) => c.id !== characterId);
      localStorage.setItem('characters', JSON.stringify(updatedCharacters));
      
      // Also remove chat history
      localStorage.removeItem(`chat_${characterId}`);

      toast({
        title: "Character deleted",
        description: `${character.name} has been permanently deleted.`,
      });

      navigate('/dashboard');
      setIsDeleting(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-600';
      case 'training': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const exportChatHistory = () => {
    const chatHistory = JSON.parse(localStorage.getItem(`chat_${characterId}`) || '[]');
    const dataStr = JSON.stringify(chatHistory, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character?.name}_chat_history.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Chat history exported",
      description: "Your chat history has been downloaded.",
    });
  };

  if (!character) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar characters={characters} />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8 max-w-4xl">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Character</h1>
            <p className="text-gray-400">View and manage your character's settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Character Overview */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={character.avatar} />
                      <AvatarFallback className="bg-gray-600 text-white text-xl">
                        {character.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-white text-2xl">{character.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className={`${getStatusColor(character.status)} text-white`}>
                          {character.status}
                        </Badge>
                        <span className="text-gray-400">{character.messages} total messages</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-base leading-relaxed">
                    {character.description}
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Training Status */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Training Status</CardTitle>
                  <CardDescription className="text-gray-400">
                    Current model information and training details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-white font-medium capitalize">{character.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="text-white font-medium">
                        {new Date(character.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Model Version</p>
                      <p className="text-white font-medium">v1.0</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Messages</p>
                      <p className="text-white font-medium">{character.messages}</p>
                    </div>
                  </div>

                  {character.status === 'training' && (
                    <div className="mt-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span className="text-blue-400">Training in progress...</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={exportChatHistory}
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Chat History
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Retrain Model
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-400">Danger Zone</CardTitle>
                  <CardDescription className="text-gray-400">
                    Irreversible actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleDeleteCharacter}
                    disabled={isDeleting}
                    variant="destructive"
                    className="w-full"
                  >
                    {isDeleting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Deleting...</span>
                      </div>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Character
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCharacter;
