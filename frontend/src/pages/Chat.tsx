
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Character {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  status: 'ready' | 'training' | 'failed';
  messages: number;
}

const Chat = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const characters = JSON.parse(localStorage.getItem('characters') || '[]');

  useEffect(() => {
    const foundCharacter = characters.find((c: Character) => c.id === characterId);
    if (!foundCharacter) {
      navigate('/dashboard');
      return;
    }
    setCharacter(foundCharacter);

    // Load chat history and ensure timestamps are Date objects
    const chatHistory = JSON.parse(localStorage.getItem(`chat_${characterId}`) || '[]');
    const messagesWithDateTimestamps = chatHistory.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    setMessages(messagesWithDateTimestamps);
  }, [characterId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    // Simple response generation based on character
    const responses = [
      `That's interesting! As ${character?.name}, I think about that differently.`,
      `I appreciate you sharing that with me. What else would you like to discuss?`,
      `From my perspective, ${userMessage.toLowerCase()} is quite fascinating.`,
      `Let me think about that... Based on my understanding, I'd say that's a great point.`,
      `That reminds me of something similar. Would you like to hear more about it?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || !character) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, aiResponse];
      setMessages(updatedMessages);
      setIsTyping(false);

      // Save chat history
      localStorage.setItem(`chat_${characterId}`, JSON.stringify(updatedMessages));

      // Update message count
      const updatedCharacters = characters.map((c: Character) => 
        c.id === characterId ? { ...c, messages: c.messages + 1 } : c
      );
      localStorage.setItem('characters', JSON.stringify(updatedCharacters));
    }, 1000 + Math.random() * 2000);
  };

  if (!character) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar characters={characters} currentCharacterId={characterId} />
      
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={character.avatar} />
              <AvatarFallback className="bg-gray-700 text-white">
                {character.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-white font-semibold">{character.name}</h2>
              <p className="text-gray-400 text-sm">AI Character</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Avatar className="h-16 w-16 mx-auto mb-4">
                <AvatarImage src={character.avatar} />
                <AvatarFallback className="bg-gray-700 text-white text-xl">
                  {character.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-white text-lg font-semibold mb-2">Chat with {character.name}</h3>
              <p className="text-gray-400 max-w-md mx-auto">{character.description}</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-white'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp instanceof Date 
                    ? message.timestamp.toLocaleTimeString()
                    : new Date(message.timestamp).toLocaleTimeString()
                  }
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-400 ml-2">{character.name} is typing...</span>
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
              placeholder={`Message ${character.name}...`}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              disabled={!inputText.trim() || isTyping}
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

export default Chat;
