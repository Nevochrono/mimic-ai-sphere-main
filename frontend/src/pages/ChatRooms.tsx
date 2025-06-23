
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Play, Settings, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  participants: string[];
  isActive: boolean;
  messageCount: number;
  createdAt: string;
}

const ChatRooms = () => {
  const [characters, setCharacters] = useState([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const savedCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
    setCharacters(savedCharacters);
    
    const savedRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');
    setChatRooms(savedRooms);
  }, []);

  const handleDeleteRoom = (roomId: string) => {
    const updatedRooms = chatRooms.filter(room => room.id !== roomId);
    setChatRooms(updatedRooms);
    localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));
    toast({
      title: "Chat room deleted",
      description: "The chat room has been permanently deleted.",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar characters={characters} />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Chat Rooms</h1>
            <p className="text-gray-400">Create multi-agent conversations with your fine-tuned models</p>
          </div>

          <div className="mb-6">
            <Link to="/create-chat-room">
              <Button className="bg-gray-100 text-gray-900 hover:bg-white transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Create New Chat Room
              </Button>
            </Link>
          </div>

          {chatRooms.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800 text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">No chat rooms yet</h3>
                    <p className="text-gray-400 mb-6">Create your first multi-agent chat room to see characters interact</p>
                    <Link to="/create-chat-room">
                      <Button className="bg-gray-100 text-gray-900 hover:bg-white transition-all duration-200">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Chat Room
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatRooms.map((room) => (
                <Card key={room.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{room.name}</CardTitle>
                      <Badge variant={room.isActive ? "default" : "secondary"} className={
                        room.isActive ? "bg-green-600 text-white" : "bg-gray-600 text-white"
                      }>
                        {room.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      {room.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-300 mb-2">Participants ({room.participants.length})</p>
                        <div className="flex -space-x-2">
                          {room.participants.slice(0, 4).map((participantId, index) => {
                            const character = characters.find((c: any) => c.id === participantId);
                            return (
                              <Avatar key={index} className="h-8 w-8 border-2 border-gray-900">
                                <AvatarImage src={character?.avatar} />
                                <AvatarFallback className="bg-gray-700 text-white text-xs">
                                  {character?.name?.charAt(0).toUpperCase() || '?'}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                          {room.participants.length > 4 && (
                            <div className="h-8 w-8 rounded-full bg-gray-700 text-white border-2 border-gray-900 flex items-center justify-center text-xs">
                              +{room.participants.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        {room.messageCount} messages • Created {new Date(room.createdAt).toLocaleDateString()}
                      </div>

                      <div className="flex space-x-2">
                        <Link to={`/chat-room/${room.id}`} className="flex-1">
                          <Button className="w-full bg-gray-100 text-gray-900 hover:bg-white transition-all duration-200">
                            <Play className="h-4 w-4 mr-2" />
                            Join Room
                          </Button>
                        </Link>
                        <Link to={`/chat-room/${room.id}/settings`}>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

export default ChatRooms;
