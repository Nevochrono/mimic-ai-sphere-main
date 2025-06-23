
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";

const CreateChatRoom = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const savedCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
    setCharacters(savedCharacters.filter((char: any) => char.status === 'ready'));
  }, []);

  const handleCharacterToggle = (characterId: string) => {
    setSelectedCharacters(prev => 
      prev.includes(characterId) 
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your chat room.",
        variant: "destructive"
      });
      return;
    }

    if (selectedCharacters.length < 2) {
      toast({
        title: "Select characters",
        description: "Please select at least 2 characters for the chat room.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    // Simulate room creation
    setTimeout(() => {
      const newRoom = {
        id: Date.now().toString(),
        name: roomName,
        description: roomDescription,
        participants: selectedCharacters,
        isActive: false,
        messageCount: 0,
        createdAt: new Date().toISOString()
      };

      const existingRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');
      const updatedRooms = [...existingRooms, newRoom];
      localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));

      toast({
        title: "Chat room created!",
        description: "Your multi-agent chat room has been created successfully.",
      });

      navigate('/chat-rooms');
      setIsCreating(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar characters={characters} />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/chat-rooms')}
              className="text-white hover:text-black hover:bg-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chat Rooms
            </Button>
            <h1 className="text-3xl font-bold text-white mb-2">Create Chat Room</h1>
            <p className="text-white/70">Set up a multi-agent conversation environment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Room Details */}
            <Card className="bg-white border-white/20">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Room Details
                </CardTitle>
                <CardDescription className="text-black/70">
                  Configure your chat room settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-name" className="text-black">Room Name</Label>
                  <Input
                    id="room-name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    className="bg-white border-black/20 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-description" className="text-black">Description (Optional)</Label>
                  <Textarea
                    id="room-description"
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                    placeholder="Describe the purpose or scenario for this chat room"
                    className="bg-white border-black/20 text-black"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Character Selection */}
            <Card className="bg-white border-white/20">
              <CardHeader>
                <CardTitle className="text-black">Select Characters</CardTitle>
                <CardDescription className="text-black/70">
                  Choose characters to participate in this chat room (minimum 2)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {characters.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-black/70 mb-4">No ready characters available</p>
                    <Button 
                      onClick={() => navigate('/create-character')}
                      variant="outline"
                      className="border-black text-black hover:bg-black hover:text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Character
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {characters.map((character: any) => (
                      <div 
                        key={character.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-black/10 hover:border-black/30 transition-colors"
                      >
                        <Checkbox
                          id={character.id}
                          checked={selectedCharacters.includes(character.id)}
                          onCheckedChange={() => handleCharacterToggle(character.id)}
                        />
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={character.avatar} />
                          <AvatarFallback className="bg-black text-white">
                            {character.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Label 
                            htmlFor={character.id} 
                            className="text-black font-medium cursor-pointer"
                          >
                            {character.name}
                          </Label>
                          <p className="text-sm text-black/70 truncate">
                            {character.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Selected Characters Summary */}
          {selectedCharacters.length > 0 && (
            <Card className="bg-white border-white/20 mt-8">
              <CardHeader>
                <CardTitle className="text-black">Selected Characters ({selectedCharacters.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {selectedCharacters.map(characterId => {
                    const character = characters.find((c: any) => c.id === characterId);
                    return (
                      <div key={characterId} className="flex items-center space-x-2 bg-black text-white px-3 py-2 rounded-lg">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={character?.avatar} />
                          <AvatarFallback className="bg-white text-black text-xs">
                            {character?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{character?.name}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/chat-rooms')}
              className="border-black text-black hover:bg-black hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="bg-black text-white hover:bg-gray-800"
            >
              {isCreating ? "Creating..." : "Create Chat Room"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChatRoom;
