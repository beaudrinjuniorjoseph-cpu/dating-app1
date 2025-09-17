import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Components
import LandingPage from "@/components/LandingPage";
import OnboardingFlow from "@/components/OnboardingFlow";
import SwipeCard, { Profile } from "@/components/SwipeCard";
import MatchesPage from "@/components/MatchesPage";
import ChatInterface from "@/components/ChatInterface";
import ProfilePage from "@/components/ProfilePage";
import VIPPage from "@/components/VIPPage";
import Navigation from "@/components/Navigation";


type AppState = 'landing' | 'onboarding' | 'main' | 'chat' | 'vip';

interface OnboardingData {
  gender: string;
  age: string;
  lookingFor: string;
  interests: string[];
  photos: string[];
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'emoji';
  voiceUrl?: string;
  duration?: number;
}

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [activeTab, setActiveTab] = useState('discover');
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isVIP, setIsVIP] = useState(false);
  const [currentChatProfile, setCurrentChatProfile] = useState<Profile | null>(null);

  // Initialize with empty data - will be populated from backend/onboarding
  const [profiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [matches] = useState<Profile[]>([]);
  const [likes] = useState<Profile[]>([]);
  const [messages] = useState<Message[]>([]);

  useEffect(() => {
    if (profiles.length > 0) {
      setCurrentProfile(profiles[currentProfileIndex]);
    }
  }, [profiles, currentProfileIndex]);

  // User profile will be created from onboarding data

  const handleGetStarted = () => {
    setAppState('onboarding');
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    console.log('Onboarding completed:', data);
    
    // Create user profile from onboarding data
    const newUserProfile: Profile = {
      id: 'current-user',
      name: 'You', // This could be collected in onboarding if needed
      age: parseInt(data.age),
      distance: 0,
      bio: `Looking for ${data.lookingFor.toLowerCase()}. Interested in ${data.interests.slice(0, 3).join(', ')}.`,
      interests: data.interests,
      photos: data.photos,
      isVerified: false
    };
    
    setUserProfile(newUserProfile);
    setAppState('main');
  };

  const handleLike = (profileId: string) => {
    console.log('Liked profile:', profileId);
    handleNextProfile();
  };

  const handleDislike = (profileId: string) => {
    console.log('Disliked profile:', profileId);
    handleNextProfile();
  };

  const handleNextProfile = () => {
    const nextIndex = currentProfileIndex + 1;
    if (nextIndex < profiles.length) {
      setCurrentProfileIndex(nextIndex);
    } else {
      // No more profiles - reset to beginning for demo
      setCurrentProfileIndex(0);
    }
  };

  const handleStartChat = (profileId: string) => {
    const profile = matches.find(p => p.id === profileId);
    if (profile) {
      setCurrentChatProfile(profile);
      setAppState('chat');
    }
  };

  const handleSendMessage = (content: string, type: 'text' | 'voice') => {
    console.log('Send message:', { content, type });
    // todo: remove mock functionality - implement actual message sending
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'profile' && appState === 'main') {
      // Stay in main state but show profile
    }
  };

  const handleUpgradeToVIP = () => {
    setAppState('vip');
  };

  const handleVIPSubscribe = (plan: 'monthly' | 'yearly') => {
    console.log('Subscribe to VIP:', plan);
    // External payment window has opened, user can complete payment there
    // Don't automatically change app state - let user return manually
  };

  const handleUpdateProfile = (updates: Partial<Profile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updates });
    }
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    setAppState('landing');
    setActiveTab('discover');
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'discover':
        return currentProfile ? (
          <div className="pb-20">
            <SwipeCard
              profile={currentProfile}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-screen pb-20">
            <p className="text-muted-foreground">No more profiles to show!</p>
          </div>
        );

      case 'matches':
        return (
          <div className="pb-20">
            <MatchesPage
              matches={matches}
              likes={likes}
              onStartChat={handleStartChat}
              onUpgradeToVIP={handleUpgradeToVIP}
              isVIP={isVIP}
            />
          </div>
        );

      case 'chat':
        return (
          <div className="pb-20">
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Your Conversations</h2>
                <p className="text-muted-foreground mb-4">
                  Start chatting with your matches!
                </p>
                {matches.length > 0 && (
                  <button
                    onClick={() => handleStartChat(matches[0].id)}
                    className="text-primary underline"
                  >
                    Chat with {matches[0].name}
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'profile':
        return userProfile ? (
          <div className="pb-20">
            <ProfilePage
              profile={userProfile}
              isVIP={isVIP}
              onUpdateProfile={handleUpdateProfile}
              onUpgradeToVIP={handleUpgradeToVIP}
              onLogout={handleLogout}
            />
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {appState === 'landing' && (
            <LandingPage onGetStarted={handleGetStarted} />
          )}

          {appState === 'onboarding' && (
            <OnboardingFlow onComplete={handleOnboardingComplete} />
          )}

          {appState === 'main' && (
            <>
              {renderMainContent()}
              <Navigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
                unreadMessages={3}
                newMatches={2}
              />
            </>
          )}

          {appState === 'chat' && currentChatProfile && (
            <ChatInterface
              profile={currentChatProfile}
              messages={messages}
              currentUserId="currentUser"
              onSendMessage={handleSendMessage}
              onBack={() => {
                setAppState('main');
                setActiveTab('matches');
                setCurrentChatProfile(null);
              }}
            />
          )}

          {appState === 'vip' && (
            <VIPPage
              onBack={() => setAppState('main')}
              onSubscribe={handleVIPSubscribe}
              isVIP={isVIP}
            />
          )}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
