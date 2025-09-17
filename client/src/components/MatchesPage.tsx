import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Crown, Sparkles } from "lucide-react";
import { Profile } from "./SwipeCard";

interface MatchesPageProps {
  matches: Profile[];
  likes: Profile[];
  onStartChat: (profileId: string) => void;
  onUpgradeToVIP: () => void;
  isVIP: boolean;
}

export default function MatchesPage({ 
  matches, 
  likes, 
  onStartChat, 
  onUpgradeToVIP, 
  isVIP 
}: MatchesPageProps) {
  const [activeTab, setActiveTab] = useState('matches');

  const MatchCard = ({ profile, isMatch = false }: { profile: Profile; isMatch?: boolean }) => (
    <Card className="hover-elevate cursor-pointer" data-testid={`card-${isMatch ? 'match' : 'like'}-${profile.id}`}>
      <div className="relative">
        <div 
          className="w-full h-48 bg-cover bg-center rounded-t-md"
          style={{ backgroundImage: `url(${profile.photos[0]})` }}
        >
          <div className="absolute top-2 right-2">
            {profile.isVerified && (
              <Badge className="bg-blue-500 text-white border-0 text-xs">
                ✓
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm" data-testid={`text-match-name-${profile.id}`}>
              {profile.name}, {profile.age}
            </h3>
            <span className="text-xs text-muted-foreground">{profile.distance}km</span>
          </div>
          
          {isMatch && (
            <Button 
              size="sm" 
              className="w-full" 
              onClick={() => onStartChat(profile.id)}
              data-testid={`button-chat-${profile.id}`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Say Hi
            </Button>
          )}
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" data-testid="text-matches-title">
          Your Connections
        </h1>
        <p className="text-muted-foreground">
          {matches.length} mutual matches • {likes.length} people liked you
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matches" data-testid="tab-matches">
            <Heart className="w-4 h-4 mr-2" />
            Matches ({matches.length})
          </TabsTrigger>
          <TabsTrigger value="likes" data-testid="tab-likes">
            <Sparkles className="w-4 h-4 mr-2" />
            Likes ({likes.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches" className="mt-6">
          {matches.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {matches.map((profile) => (
                <MatchCard key={profile.id} profile={profile} isMatch={true} />
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">No matches yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Keep swiping to find your perfect match!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="likes" className="mt-6">
          {!isVIP ? (
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2 text-amber-800 dark:text-amber-200">
                  <Crown className="w-6 h-6" />
                  <span>Upgrade to VIP</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-amber-700 dark:text-amber-300">
                  See who liked you with VIP membership!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="aspect-square bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-800 dark:to-amber-700 rounded-lg flex items-center justify-center"
                    >
                      <Heart className="w-8 h-8 text-amber-600 dark:text-amber-200" />
                    </div>
                  ))}
                </div>
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                  onClick={onUpgradeToVIP}
                  data-testid="button-upgrade-vip"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to VIP - $15/month
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {likes.map((profile) => (
                <MatchCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}