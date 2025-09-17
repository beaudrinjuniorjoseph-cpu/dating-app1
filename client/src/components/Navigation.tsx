import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Users, MessageCircle, User, Flame } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadMessages?: number;
  newMatches?: number;
}

export default function Navigation({ 
  activeTab, 
  onTabChange, 
  unreadMessages = 0, 
  newMatches = 0 
}: NavigationProps) {
  const tabs = [
    {
      id: 'discover',
      icon: Flame,
      label: 'Discover',
      badge: null
    },
    {
      id: 'matches',
      icon: Users,
      label: 'Matches',
      badge: newMatches > 0 ? newMatches : null
    },
    {
      id: 'chat',
      icon: MessageCircle,
      label: 'Chat',
      badge: unreadMessages > 0 ? unreadMessages : null
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile',
      badge: null
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-around items-center py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 p-2 h-auto min-h-[60px] relative ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => onTabChange(tab.id)}
                data-testid={`nav-tab-${tab.id}`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${
                    isActive ? 'fill-primary/20' : ''
                  }`} />
                  {tab.badge && (
                    <Badge 
                      className="absolute -top-2 -right-2 w-5 h-5 text-xs p-0 flex items-center justify-center bg-destructive text-destructive-foreground border-0"
                      data-testid={`badge-${tab.id}-${tab.badge}`}
                    >
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 w-1 h-1 bg-primary rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}