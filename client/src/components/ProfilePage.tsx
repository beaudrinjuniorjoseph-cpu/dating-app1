import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Edit3, 
  Camera, 
  MapPin, 
  Heart, 
  Settings, 
  Bell, 
  Shield, 
  LogOut,
  Crown,
  Plus,
  X
} from "lucide-react";
import { Profile } from "./SwipeCard";
import AddPhotos from "./AddPhotos";

interface ProfilePageProps {
  profile: Profile;
  isVIP: boolean;
  onUpdateProfile: (updates: Partial<Profile>) => void;
  onUpgradeToVIP: () => void;
  onLogout: () => void;
}

const allInterests = [
  'Music', 'Travel', 'Photography', 'Fitness', 'Cooking', 'Movies',
  'Books', 'Art', 'Sports', 'Gaming', 'Dancing', 'Hiking',
  'Coffee', 'Wine', 'Yoga', 'Fashion', 'Tech', 'Pets'
];

export default function ProfilePage({ 
  profile, 
  isVIP, 
  onUpdateProfile, 
  onUpgradeToVIP, 
  onLogout 
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddPhotos, setShowAddPhotos] = useState(false);
  const [editData, setEditData] = useState({
    bio: profile.bio,
    interests: [...profile.interests]
  });
  
  const [notifications, setNotifications] = useState({
    newMatches: true,
    messages: true,
    likes: false,
    promotions: false
  });
  
  const [privacy, setPrivacy] = useState({
    showDistance: true,
    showAge: true,
    onlineStatus: true
  });

  const handleSave = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  const handleInterestToggle = (interest: string) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handlePhotoUpload = () => {
    setShowAddPhotos(true);
  };

  if (showAddPhotos) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Add Photos</h1>
          <Button
            variant="outline"
            onClick={() => setShowAddPhotos(false)}
          >
            Back to Profile
          </Button>
        </div>
        <AddPhotos
          photos={profile.photos}
          onPhotosChange={(photos) => {
            onUpdateProfile({ photos });
            setShowAddPhotos(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.photos[0]} />
                <AvatarFallback className="text-xl">{profile.name[0]}</AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute -bottom-1 -right-1 w-8 h-8"
                onClick={handlePhotoUpload}
                data-testid="button-upload-photo"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-bold" data-testid="text-profile-name">
                  {profile.name}, {profile.age}
                </h2>
                {profile.isVerified && (
                  <Badge className="bg-blue-500 text-white border-0">
                    ✓ Verified
                  </Badge>
                )}
                {isVIP && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    VIP
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-muted-foreground text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Last active 2 hours ago</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                data-testid="button-edit-profile"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio & Interests */}
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell people about yourself..."
                  className="mt-1"
                  data-testid="textarea-bio"
                />
              </div>
              
              <div>
                <Label>Interests (select up to 10)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={editData.interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer hover-elevate"
                      onClick={() => handleInterestToggle(interest)}
                      data-testid={`badge-edit-interest-${interest.toLowerCase()}`}
                    >
                      {interest}
                      {editData.interests.includes(interest) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {editData.interests.length}/10 interests selected
                </p>
              </div>
              
              <Button onClick={handleSave} data-testid="button-save-profile">
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">{profile.bio}</p>
              
              <div>
                <h4 className="font-semibold mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>My Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {profile.photos.map((photo, index) => (
              <div key={index} className="relative aspect-square">
                <img 
                  src={photo} 
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
            {profile.photos.length < 6 && (
              <Button 
                variant="outline" 
                className="aspect-square flex flex-col items-center justify-center"
                onClick={handlePhotoUpload}
                data-testid="button-add-photo"
              >
                <Plus className="w-6 h-6 mb-1" />
                <span className="text-xs">Add Photo</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* VIP Upgrade */}
      {!isVIP && (
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
              <Crown className="w-5 h-5" />
              <span>Upgrade to VIP</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-amber-700 dark:text-amber-300">
              <p className="flex items-center"><Heart className="w-4 h-4 mr-2" />See who liked you</p>
              <p className="flex items-center"><Shield className="w-4 h-4 mr-2" />Advanced privacy controls</p>
              <p className="flex items-center"><Settings className="w-4 h-4 mr-2" />More search filters</p>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0"
              onClick={onUpgradeToVIP}
              data-testid="button-upgrade-to-vip"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade for $15/month
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notifications */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">New matches</span>
                <Switch 
                  checked={notifications.newMatches}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newMatches: checked }))}
                  data-testid="switch-notifications-matches"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Messages</span>
                <Switch 
                  checked={notifications.messages}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, messages: checked }))}
                  data-testid="switch-notifications-messages"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New likes</span>
                <Switch 
                  checked={notifications.likes}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, likes: checked }))}
                  data-testid="switch-notifications-likes"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Privacy */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Show distance</span>
                <Switch 
                  checked={privacy.showDistance}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showDistance: checked }))}
                  data-testid="switch-privacy-distance"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show age</span>
                <Switch 
                  checked={privacy.showAge}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showAge: checked }))}
                  data-testid="switch-privacy-age"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Online status</span>
                <Switch 
                  checked={privacy.onlineStatus}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, onlineStatus: checked }))}
                  data-testid="switch-privacy-online"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Logout */}
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={onLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
