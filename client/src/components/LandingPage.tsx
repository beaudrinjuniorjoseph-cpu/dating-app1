import { Button } from "@/components/ui/button";
import { Heart, Users, MessageCircle, Shield } from "lucide-react";
import heroImage from "@assets/generated_images/Dating_app_hero_background_6f10d475.png";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-white">Spark</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Find Your
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent"> Perfect </span>
            Match
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with amazing people nearby. Swipe, match, and start meaningful conversations.
          </p>
          
          <Button 
            size="lg" 
            className="mx-auto text-lg px-8 py-6 bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 border-0 shadow-xl"
            onClick={onGetStarted}
            data-testid="button-get-started"
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="p-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/80 text-sm">Smart Matching</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/80 text-sm">Real-time Chat</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/80 text-sm">Verified Profiles</p>
          </div>
        </div>
      </div>
    </div>
  );
}