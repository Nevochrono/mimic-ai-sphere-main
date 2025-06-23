
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateCharacter from "./pages/CreateCharacter";
import Chat from "./pages/Chat";
import ManageCharacter from "./pages/ManageCharacter";
import Profile from "./pages/Profile";
import ChatRooms from "./pages/ChatRooms";
import CreateChatRoom from "./pages/CreateChatRoom";
import ChatRoom from "./pages/ChatRoom";
import ChatRoomSettings from "./pages/ChatRoomSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-character" element={<CreateCharacter />} />
            <Route path="/chat/:characterId" element={<Chat />} />
            <Route path="/manage/:characterId" element={<ManageCharacter />} />
            <Route path="/chat-rooms" element={<ChatRooms />} />
            <Route path="/create-chat-room" element={<CreateChatRoom />} />
            <Route path="/chat-room/:roomId" element={<ChatRoom />} />
            <Route path="/chat-room/:roomId/settings" element={<ChatRoomSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
