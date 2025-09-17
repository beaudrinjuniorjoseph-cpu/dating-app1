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

// Mock data - todo: remove mock functionality
import profilePhoto1 from '@assets/generated_images/Profile_photo_woman_5e08a65b.png';
import profilePhoto2 from '@assets/generated_images/Profile_photo_man_e9dc1d86.png';
import profilePhoto3 from '@assets/generated_images/Profile_photo_woman_two_dae67ecf.png';
import profilePhoto4 from '@assets/generated_images/Profile_photo_man_two_b11497d8.png';

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

  // Mock data - todo: remove mock functionality
  const mockProfiles: Profile[] = [
    {
      id: '1',
      name: 'Emma',
      age: 26,
      distance: 3,
      bio: 'Love hiking, good coffee, and spontaneous adventures. Looking for someone to explore the city with!',
      interests: ['Travel', 'Photography', 'Coffee', 'Hiking', 'Music', 'Books'],
      photos: [profilePhoto1, profilePhoto2],
      isVerified: true
    },
    {
      id: '2',
      name: 'Alex',
      age: 28,
      distance: 5,
      bio: 'Photographer and adventure seeker. Always up for new experiences and great conversations.',
      interests: ['Photography', 'Travel', 'Art', 'Movies'],
      photos: [profilePhoto2, profilePhoto1],
      isVerified: false
    },
    {
      id: '3',
      name: 'Sarah',
      age: 25,
      distance: 2,
      bio: 'Yoga instructor and foodie. Believe in living life to the fullest and spreading positive vibes.',
      interests: ['Yoga', 'Cooking', 'Fitness', 'Books'],
      photos: [profilePhoto3, profilePhoto4],
      isVerified: true
    }
  ];

  const mockMatches: Profile[] = [
    {
      id: '1',
      name: 'Emma',
      age: 26,
      distance: 3,
      bio: 'Love hiking and good coffee',
      interests: ['Travel', 'Photography'],
      photos: [profilePhoto1],
      isVerified: true
    },
    {
      id: '2',
      name: 'Alex',
      age: 28,
      distance: 5,
      bio: 'Photographer and adventure seeker',
      interests: ['Photography', 'Travel'],
      photos: [profilePhoto2],
      isVerified: false
    }
  ];

  const mockLikes: Profile[] = [
    {
      id: '3',
      name: 'Sarah',
      age: 25,
      distance: 2,
      bio: 'Yoga instructor and foodie',
      interests: ['Yoga', 'Cooking'],
      photos: [profilePhoto3],
      isVerified: true
    },
    {
      id: '4',
      name: 'Mike',
      age: 30,
      distance: 7,
      bio: 'Software engineer who loves music',
      interests: ['Tech', 'Music'],
      photos: [profilePhoto4],
      isVerified: false
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: '1',
      content: 'Hey! Thanks for the match! 😊',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    },
    {
      id: '2',
      senderId: 'currentUser',
      content: 'Hi Emma! I love your photos from your hiking trip!',
      timestamp: new Date(Date.now() - 3300000),
      type: 'text'
    },
    {
      id: '3',
      senderId: '1',
      content: 'Thank you! Do you like hiking too? 🏔️',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text'
    }
  ];

  const [profiles] = useState<Profile[]>(mockProfiles);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [matches] = useState<Profile[]>(mockMatches);
  const [likes] = useState<Profile[]>(mockLikes);
  const [messages] = useState<Message[]>(mockMessages);

  useEffect(() => {
    if (profiles.length > 0) {
      setCurrentProfile(profiles[currentProfileIndex]);
    }
  }, [profiles, currentProfileIndex]);

  useEffect(() => {
    // todo: remove mock functionality - create actual user profile from onboarding
    if (!userProfile) {
      setUserProfile({
        id: 'current-user',
        name: 'You',
        age: 27,
        distance: 0,
        bio: 'Adventure seeker, coffee lover, and dog person. Always up for trying new restaurants or exploring hiking trails.',
        interests: ['Travel', 'Photography', 'Coffee', 'Hiking', 'Music', 'Cooking'],
        photos: [profilePhoto1, profilePhoto2],
        isVerified: true
      });
    }
  }, [userProfile]);

  const handleGetStarted = () => {
    setAppState('onboarding');
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    console.log('Onboarding completed:', data);
    // todo: remove mock functionality - use actual onboarding data
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
    setIsVIP(true);
    setAppState('main');
    setActiveTab('matches');
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
