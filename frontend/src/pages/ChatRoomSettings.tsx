
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trash2, UserMinus, Save } from "lucide-react";
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

const ChatRoomSettings = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const savedCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
    setCharacters(savedCharacters);
    
    const savedRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');
    const foundRoom = savedRooms.find((room: ChatRoom) => room.id === roomId);
    
    if (!foundRoom) {
      navigate('/chat-rooms');
      return;
    }
    
    setChatRoom(foundRoom);
    setRoomName(foundRoom.name);
    setRoomDescription(foundRoom.description);
    setIsActive(foundRoom.isActive);
  }, [roomId, navigate]);

  const handleSaveSettings = () => {
    if (!chatRoom) return;

    const savedRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');
    const updatedRooms = savedRooms.map((room: ChatRoom) => 
      room.id === roomId 
        ? { ...room, name: roomName, description: roomDescription, isActive }
        : room
    );
    
    localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));
    setChatRoom(prev => prev ? { ...prev, name: roomName, description: roomDescription, isActive } : null);
    
    toast({
      title: "Settings saved",
      description: "Chat room settings have been updated successfully.",
    });
  };

  const handleRemoveParticipant = (participantId: string) => {
    if (!chatRoom) return;

    const updatedParticipants = chatRoom.participants.filter(id => id !== participantId);
    const savedRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');
    const updatedRooms = savedRooms.map((room: ChatRoom) => 
      room.id === roomId 
        ? { ...room, participants: updatedParticipants }
        : room
    );
    
    localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));
    setChatRoom(prev => prev ? { ...prev, participants: updatedParticipants } : null);
    
    toast({
      title: "Participant removed",
      description: "Character has been removed from the chat room.",
    });
  };

  const handleDeleteRoom = () => {
    const savedRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');
    const updatedRooms = savedRooms.filter((room: ChatRoom) => room.id !== roomId);
    localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));
    
    // Also delete chat history
    localStorage.removeItem(`chatRoom_${roomId}`);
    
    toast({
      title: "Chat room deleted",
      description: "The chat room and all its messages have been permanently deleted.",
    });
    
    navigate('/chat-rooms');
  };

  if (!chatRoom) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar characters={characters} />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/chat-rooms')}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat Rooms
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Chat Room Settings</h1>
            <p className="text-gray-400">Manage your chat room configuration and participants</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* General Settings */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="roomName" className="text-gray-300">Room Name</Label>
                  <Input
                    id="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roomDescription" className="text-gray-300">Description</Label>
                  <Textarea
                    id="roomDescription"
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-300">Room Status</Label>
                    <p className="text-sm text-gray-500">Enable or disable the chat room</p>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>

                <Button 
                  onClick={handleSaveSettings}
                  className="w-full bg-gray-100 text-gray-900 hover:bg-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Participants ({chatRoom.participants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chatRoom.participants.map((participantId) => {
                    const character = characters.find((c: any) => c.id === participantId);
                    if (!character) return null;
                    
                    return (
                      <div key={participantId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={character.avatar} />
                            <AvatarFallback className="bg-gray-700 text-white">
                              {character.name?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{character.name}</p>
                            <Badge 
                              variant={character.status === 'ready' ? 'default' : 'secondary'}
                              className={character.status === 'ready' ? 'bg-green-600' : 'bg-gray-600'}
                            >
                              {character.status}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveParticipant(participantId)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                  
                  {chatRoom.participants.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No participants in this room</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Room Statistics */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Messages</span>
                  <span className="text-white font-medium">{chatRoom.messageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white font-medium">
                    {new Date(chatRoom.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <Badge variant={chatRoom.isActive ? 'default' : 'secondary'}>
                    {chatRoom.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-gray-900 border-red-500">
              <CardHeader>
                <CardTitle className="text-red-400">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Delete Chat Room</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      This action cannot be undone. This will permanently delete the chat room and all messages.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteRoom}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Chat Room
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomSettings;
