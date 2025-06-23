
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ExternalLink, Save, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";

const Profile = () => {
  const [characters, setCharacters] = useState([]);
  const [profile, setProfile] = useState({
    email: '',
    name: '',
    avatar: '',
    defaultModel: 'llama-3.1-8b',
    vendor: 'unsloth',
    huggingFaceToken: '',
    huggingFaceUsername: ''
  });

  useEffect(() => {
    const savedCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
    setCharacters(savedCharacters);
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const savedProfile = JSON.parse(localStorage.getItem('profile') || '{}');
    setProfile({
      email: user.email || '',
      name: savedProfile.name || '',
      avatar: savedProfile.avatar || '',
      defaultModel: savedProfile.defaultModel || 'llama-3.1-8b',
      vendor: savedProfile.vendor || 'unsloth',
      huggingFaceToken: savedProfile.huggingFaceToken || '',
      huggingFaceUsername: savedProfile.huggingFaceUsername || ''
    });
  }, []);

  const handleSave = () => {
    localStorage.setItem('profile', JSON.stringify(profile));
    toast({
      title: "Profile updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleHuggingFaceConnect = () => {
    if (profile.huggingFaceUsername) {
      window.open(`https://huggingface.co/${profile.huggingFaceUsername}`, '_blank');
    } else {
      toast({
        title: "Username required",
        description: "Please enter your Hugging Face username first.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar characters={characters} />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 gradient-text">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account and model preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="bg-card border-border hover-scale animate-slide-up">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 transition-transform duration-200 hover:scale-105">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                      {profile.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-card-foreground">Display Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your display name"
                    className="bg-input border-border text-foreground transition-all duration-200 focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-card-foreground">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    readOnly
                    className="bg-muted border-border text-muted-foreground"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Model Settings */}
            <Card className="bg-card border-border hover-scale animate-slide-up">
              <CardHeader>
                <CardTitle className="text-card-foreground">Model Preferences</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure your default AI model settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-card-foreground">Default Model</Label>
                  <Select value={profile.defaultModel} onValueChange={(value) => setProfile({ ...profile, defaultModel: value })}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="llama-3.1-8b">Llama 3.1 8B</SelectItem>
                      <SelectItem value="llama-3.1-70b">Llama 3.1 70B</SelectItem>
                      <SelectItem value="mistral-7b">Mistral 7B</SelectItem>
                      <SelectItem value="codellama-34b">CodeLlama 34B</SelectItem>
                      <SelectItem value="gemma-7b">Gemma 7B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor" className="text-card-foreground">Fine-tuning Vendor</Label>
                  <Select value={profile.vendor} onValueChange={(value) => setProfile({ ...profile, vendor: value })}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="unsloth">Unsloth</SelectItem>
                      <SelectItem value="axolotl">Axolotl</SelectItem>
                      <SelectItem value="transformers">Transformers</SelectItem>
                      <SelectItem value="peft">PEFT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Hugging Face Integration */}
            <Card className="bg-card border-border lg:col-span-2 hover-scale animate-slide-up">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Hugging Face Integration
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Connect your Hugging Face account to import and export models
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hf-username" className="text-card-foreground">Hugging Face Username</Label>
                    <Input
                      id="hf-username"
                      value={profile.huggingFaceUsername}
                      onChange={(e) => setProfile({ ...profile, huggingFaceUsername: e.target.value })}
                      placeholder="your-username"
                      className="bg-input border-border text-foreground transition-all duration-200 focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hf-token" className="text-card-foreground">Access Token</Label>
                    <Input
                      id="hf-token"
                      type="password"
                      value={profile.huggingFaceToken}
                      onChange={(e) => setProfile({ ...profile, huggingFaceToken: e.target.value })}
                      placeholder="hf_xxxxxxxxxxxxxxxx"
                      className="bg-input border-border text-foreground transition-all duration-200 focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button 
                    onClick={handleHuggingFaceConnect}
                    variant="outline"
                    className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Profile
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  >
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover-scale"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
