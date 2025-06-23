
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Bot, Zap, Camera, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";

const CreateCharacter = () => {
  const [characters, setCharacters] = useState(() => {
    return JSON.parse(localStorage.getItem('characters') || '[]');
  });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['.txt', '.json', '.csv'];
      const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (allowedTypes.includes(fileExtension)) {
        setFile(selectedFile);
        simulateUpload();
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a .txt, .json, or .csv file.",
          variant: "destructive"
        });
      }
    }
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      
      if (allowedTypes.includes(selectedFile.type)) {
        setProfilePicture(selectedFile);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfilePicturePreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or GIF image.",
          variant: "destructive"
        });
      }
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview("");
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCreateCharacter = () => {
    if (!name || !description || !file) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and upload a dataset.",
        variant: "destructive"
      });
      return;
    }

    setIsTraining(true);

    // Simulate character creation and training
    setTimeout(() => {
      const newCharacter = {
        id: Date.now().toString(),
        name,
        description,
        status: 'training' as const,
        messages: 0,
        avatar: profilePicturePreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      };

      const updatedCharacters = [...characters, newCharacter];
      setCharacters(updatedCharacters);
      localStorage.setItem('characters', JSON.stringify(updatedCharacters));

      toast({
        title: "Character created!",
        description: `${name} has been created and training has started.`,
      });

      // Simulate training completion after a few seconds
      setTimeout(() => {
        const finalCharacters = updatedCharacters.map(char => 
          char.id === newCharacter.id ? { ...char, status: 'ready' as const } : char
        );
        localStorage.setItem('characters', JSON.stringify(finalCharacters));
      }, 5000);

      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar characters={characters} />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 gradient-text">Create New Character</h1>
            <p className="text-gray-400">Design and train your AI character with custom personality and knowledge</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Character Details */}
            <Card className="bg-gray-900 border-gray-800 hover-scale animate-slide-up">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  Character Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Define your character's personality and traits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="space-y-3">
                  <Label htmlFor="profile-picture" className="text-white">Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {profilePicturePreview ? (
                        <div className="relative">
                          <img 
                            src={profilePicturePreview} 
                            alt="Profile preview" 
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
                          />
                          <button
                            onClick={removeProfilePicture}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                          <Camera className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                        id="profile-picture-upload"
                      />
                      <label htmlFor="profile-picture-upload">
                        <Button type="button" variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Picture
                        </Button>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (max 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Character Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter character name"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your character's personality, background, and how they should behave..."
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 min-h-32 focus:border-gray-600"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dataset Upload */}
            <Card className="bg-gray-900 border-gray-800 hover-scale animate-slide-up">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Training Dataset
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload conversation data to train your character
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center transition-all duration-200 hover:border-gray-600">
                  <input
                    type="file"
                    accept=".txt,.json,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">
                      {file ? file.name : "Click to upload dataset"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Supports .txt, .json, .csv files (max 10MB)
                    </p>
                  </label>
                </div>
                
                {isUploading && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Uploading...</span>
                      <span className="text-gray-400">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Training Section */}
          <Card className="mt-6 bg-gray-900 border-gray-800 hover-scale animate-slide-up">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                {isTraining ? "Training in Progress" : "Ready to Train"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {isTraining 
                  ? "Your character is being trained. This may take a few minutes."
                  : "Start training your character once all information is provided"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleCreateCharacter}
                disabled={!name || !description || !file || isTraining}
                className="w-full bg-white text-black hover:bg-gray-200 transition-all duration-200 hover-scale disabled:opacity-50"
              >
                {isTraining ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Training Character...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Start Training</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateCharacter;
