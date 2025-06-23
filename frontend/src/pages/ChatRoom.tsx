
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft, Users, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";

interface Message {
  id: string;
  text: string;
  characterId: string;
  characterName: string;
  timestamp: Date;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  participants: string[];
  isActive: boolean;
  messageCount: number;
  createdAt: string;
}

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [characters, setCharacters] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Load chat room messages
    const roomMessages = JSON.parse(localStorage.getItem(`chatRoom_${roomId}`) || '[]');
    const messagesWithDateTimestamps = roomMessages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    setMessages(messagesWithDateTimestamps);
  }, [roomId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getCharacterById = (id: string) => {
    return characters.find((c: any) => c.id === id);
  };

  const generateMultiAgentResponse = (userMessage: string): Message[] => {
    if (!chatRoom) return [];

    const responses: Message[] = [];
    const availableCharacters = chatRoom.participants
      .map(id => getCharacterById(id))
      .filter(char => char && char.status === 'ready');

    // Simulate 1-3 characters responding
    const respondingCount = Math.min(Math.floor(Math.random() * 3) + 1, availableCharacters.length);
    const respondingCharacters = availableCharacters
      .sort(() => 0.5 - Math.random())
      .slice(0, respondingCount);

    respondingCharacters.forEach((character: any, index) => {
      const responseTemplates = [
        `Interesting perspective! As ${character.name}, I'd add that...`,
        `${character.name} here - I think we should consider...`,
        `From my experience as ${character.name}, I've noticed...`,
        `That's a great point! ${character.name} would say...`,
        `Building on that, ${character.name} believes...`,
      ];

      const response: Message = {
        id: `${Date.now()}_${index}`,
        text: responseTemplates[Math.floor(Math.random() * responseTemplates.length)],
        characterId: character.id,
        characterName: character.name,
        timestamp: new Date(Date.now() + (index + 1) * 1000),
      };

      responses.push(response);
    });

    return responses;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || !chatRoom) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      characterId: 'user',
      characterName: 'You',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsProcessing(true);

    // Simulate multi-agent responses
    setTimeout(() => {
      const aiResponses = generateMultiAgentResponse(userMessage.text);
      const updatedMessages = [...newMessages, ...aiResponses];
      setMessages(updatedMessages);
      setIsProcessing(false);

      // Save chat room messages
      localStorage.setItem(`chatRoom_${roomId}`, JSON.stringify(updatedMessages));

      // Update message count
      const savedRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');
      const updatedRooms = savedRooms.map((room: ChatRoom) => 
        room.id === roomId ? { ...room, messageCount: room.messageCount + 1 + aiResponses.length } : room
      );
      localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));
    }, 1500 + Math.random() * 2000);
  };

  if (!chatRoom) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar characters={characters} />
      
      <div className="flex-1 flex flex-col">
        {/* Chat Room Header */}
        <div className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/chat-rooms')}
                className="text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">{chatRoom.name}</h2>
                  <p className="text-gray-400 text-sm">{chatRoom.participants.length} participants</p>
                </div>
              </div>
              <Badge variant={chatRoom.isActive ? "default" : "secondary"} className={
                chatRoom.isActive ? "bg-green-600 text-white" : "bg-gray-600 text-white"
              }>
                {chatRoom.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Participants Bar */}
        <div className="bg-gray-900 border-b border-gray-800 p-3">
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-sm">Active:</span>
            <div className="flex -space-x-2">
              {chatRoom.participants.map((participantId) => {
                const character = getCharacterById(participantId);
                if (!character) return null;
                return (
                  <Avatar key={participantId} className="h-6 w-6 border-2 border-gray-900">
                    <AvatarImage src={character.avatar} />
                    <AvatarFallback className="bg-gray-700 text-white text-xs">
                      {character.name?.charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">Welcome to {chatRoom.name}</h3>
              <p className="text-gray-400 max-w-md mx-auto">{chatRoom.description}</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              {message.characterId === 'user' ? (
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-sm font-semibold">U</span>
                </div>
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getCharacterById(message.characterId)?.avatar} />
                  <AvatarFallback className="bg-gray-700 text-white text-xs">
                    {message.characterName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-sm font-medium ${
                    message.characterId === 'user' ? 'text-white' : 'text-gray-300'
                  }`}>
                    {message.characterName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp instanceof Date 
                      ? message.timestamp.toLocaleTimeString()
                      : new Date(message.timestamp).toLocaleTimeString()
                    }
                  </span>
                </div>
                <div className={`inline-block px-3 py-2 rounded-lg ${
                  message.characterId === 'user'
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-white'
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              </div>
              <div className="bg-gray-800 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-400 ml-2">Characters are responding...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-gray-900 border-t border-gray-800 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message to the group..."
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
              disabled={isProcessing}
            />
            <Button 
              type="submit" 
              disabled={!inputText.trim() || isProcessing}
              className="bg-white text-black hover:bg-gray-200"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
