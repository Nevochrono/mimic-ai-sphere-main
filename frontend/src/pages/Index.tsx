
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users, Sparkles, ArrowRight, Bot, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-gray-100" />
              <span className="text-xl font-bold text-white">AI Characters</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gray-100 text-gray-900 hover:bg-white transition-all duration-200">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Create & Chat with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 block">
              AI Characters
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 animate-fade-in max-w-2xl mx-auto">
            Build unique AI personalities, engage in meaningful conversations, and create multi-agent chat rooms 
            where characters interact with each other.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/register">
              <Button className="bg-gray-100 text-gray-900 hover:bg-white px-8 py-3 text-lg transition-all duration-200 hover:scale-105">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Everything you need to create amazing AI experiences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200 hover:scale-105">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
                <CardTitle className="text-white">1-on-1 Conversations</CardTitle>
                <CardDescription className="text-gray-400">
                  Create unique AI characters and have deep, meaningful conversations with them
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200 hover:scale-105">
              <CardHeader>
                <Users className="h-12 w-12 text-gray-300 mb-4" />
                <CardTitle className="text-white">Multi-Agent Chat Rooms</CardTitle>
                <CardDescription className="text-gray-400">
                  Watch your AI characters interact with each other in dynamic group conversations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200 hover:scale-105">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-gray-300 mb-4" />
                <CardTitle className="text-white">Easy Character Creation</CardTitle>
                <CardDescription className="text-gray-400">
                  Simple tools to define personalities, backstories, and behaviors for your characters
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-300">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Create Characters</h3>
              <p className="text-gray-400">Define personalities, backgrounds, and conversation styles</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-300">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Start Chatting</h3>
              <p className="text-gray-400">Engage in conversations or create group chat rooms</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-300">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Watch Magic Happen</h3>
              <p className="text-gray-400">Experience unique interactions and dynamic conversations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start your AI journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of creators building amazing AI characters
          </p>
          <Link to="/register">
            <Button className="bg-gray-100 text-gray-900 hover:bg-white px-8 py-4 text-lg transition-all duration-200 hover:scale-105">
              <Zap className="mr-2 h-5 w-5" />
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            © 2024 AI Characters. Built with love for the AI community.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
