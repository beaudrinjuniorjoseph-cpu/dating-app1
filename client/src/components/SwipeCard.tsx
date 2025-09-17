import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MapPin, Verified } from "lucide-react";

export interface Profile {
  id: string;
  name: string;
  age: number;
  distance: number;
  bio: string;
  interests: string[];
  photos: string[];
  isVerified: boolean;
}

interface SwipeCardProps {
  profile: Profile;
  onLike: (profileId: string) => void;
  onDislike: (profileId: string) => void;
}

export default function SwipeCard({ profile, onLike, onDislike }: SwipeCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handlePhotoClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    
    if (clickX > centerX && currentPhotoIndex < profile.photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    } else if (clickX < centerX && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX;
    
    const handleMouseMove = (e: MouseEvent) => {
      const offset = e.clientX - startX;
      setDragOffset(offset);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      if (Math.abs(dragOffset) > 100) {
        if (dragOffset > 0) {
          onLike(profile.id);
        } else {
          onDislike(profile.id);
        }
      }
      setDragOffset(0);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <Card 
        className={`relative w-full h-[600px] overflow-hidden border-0 shadow-2xl transition-all duration-200 ${
          isDragging ? 'cursor-grabbing scale-95' : 'cursor-grab hover:scale-[1.02]'
        }`}
        style={{
          transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)`,
          opacity: isDragging ? 0.9 : 1
        }}
        onMouseDown={handleMouseDown}
        data-testid={`card-profile-${profile.id}`}
      >
        {/* Photo */}
        <div 
          className="relative w-full h-2/3 bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${profile.photos[currentPhotoIndex]})` }}
          onClick={handlePhotoClick}
        >
          {/* Photo indicators */}
          <div className="absolute top-3 left-3 right-3 flex space-x-1">
            {profile.photos.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          
          {/* Verified badge */}
          {profile.isVerified && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-blue-500 text-white border-0">
                <Verified className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          )}
          
          {/* Swipe indicators */}
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center">
              {dragOffset > 50 && (
                <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg rotate-12">
                  LIKE
                </div>
              )}
              {dragOffset < -50 && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg -rotate-12">
                  NOPE
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="p-4 h-1/3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold" data-testid={`text-name-${profile.id}`}>
                  {profile.name}, {profile.age}
                </h3>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span data-testid={`text-distance-${profile.id}`}>{profile.distance} km away</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{profile.bio}</p>
            
            <div className="flex flex-wrap gap-1">
              {profile.interests.slice(0, 3).map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {profile.interests.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{profile.interests.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex justify-center space-x-6 mt-4">
        <Button
          size="icon"
          variant="outline"
          className="w-14 h-14 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-white"
          onClick={() => onDislike(profile.id)}
          data-testid={`button-dislike-${profile.id}`}
        >
          <X className="w-6 h-6" />
        </Button>
        
        <Button
          size="icon"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 border-0"
          onClick={() => onLike(profile.id)}
          data-testid={`button-like-${profile.id}`}
        >
          <Heart className="w-7 h-7 fill-white" />
        </Button>
      </div>
    </div>
  );
}