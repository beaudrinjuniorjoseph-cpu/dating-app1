import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Crown, 
  Heart, 
  Eye, 
  Filter, 
  Gift, 
  Shield, 
  Star,
  Check,
  ArrowLeft,
  CreditCard
} from "lucide-react";

interface VIPPageProps {
  onBack: () => void;
  onSubscribe: (plan: 'monthly' | 'yearly') => void;
  isVIP: boolean;
}

const features = [
  {
    icon: Heart,
    title: "See Who Liked You",
    description: "View all profiles that swiped right on you",
    isHighlight: true
  },
  {
    icon: Eye,
    title: "Unlimited Likes",
    description: "Like as many profiles as you want"
  },
  {
    icon: Filter,
    title: "Advanced Filters",
    description: "Filter by interests, lifestyle, and more"
  },
  {
    icon: Gift,
    title: "Send Virtual Gifts",
    description: "Stand out with premium virtual gifts"
  },
  {
    icon: Shield,
    title: "Enhanced Privacy",
    description: "Control who can see your profile"
  },
  {
    icon: Star,
    title: "Priority Likes",
    description: "Your likes are seen first by other users"
  }
];

const gifts = [
  { emoji: "🌹", name: "Rose", price: "$2" },
  { emoji: "💎", name: "Diamond", price: "$5" },
  { emoji: "🍾", name: "Champagne", price: "$3" },
  { emoji: "🎁", name: "Gift Box", price: "$4" },
  { emoji: "💫", name: "Star", price: "$1" },
  { emoji: "❤️", name: "Heart", price: "$1" }
];

export default function VIPPage({ onBack, onSubscribe, isVIP }: VIPPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    monthly: {
      price: "$15",
      period: "month",
      savings: null
    },
    yearly: {
      price: "$120",
      period: "year",
      savings: "Save 33%"
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          data-testid="button-back-vip"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <Crown className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl font-bold">Spark VIP</h1>
        </div>
      </div>

      {isVIP && (
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6 text-center">
            <Crown className="w-12 h-12 text-amber-500 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-1">
              You\'re already VIP!
            </h2>
            <p className="text-amber-700 dark:text-amber-300">
              Enjoy all premium features
            </p>
          </CardContent>
        </Card>
      )}

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={index} 
              className={`hover-elevate transition-all ${
                feature.isHighlight 
                  ? 'ring-2 ring-primary bg-gradient-to-br from-primary/5 to-primary/10' 
                  : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    feature.isHighlight 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    {feature.isHighlight && (
                      <Badge className="mt-2 bg-primary text-primary-foreground border-0">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Virtual Gifts Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5" />
            <span>Virtual Gifts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Send special gifts to make your matches smile
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {gifts.map((gift, index) => (
              <div 
                key={index}
                className="text-center p-3 rounded-lg bg-muted hover-elevate cursor-pointer"
                data-testid={`gift-${gift.name.toLowerCase()}`}
              >
                <div className="text-2xl mb-1">{gift.emoji}</div>
                <div className="text-xs font-medium">{gift.name}</div>
                <div className="text-xs text-muted-foreground">{gift.price}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!isVIP && (
        <>
          {/* Pricing Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(plans).map(([key, plan]) => (
                  <Card 
                    key={key}
                    className={`cursor-pointer transition-all hover-elevate ${
                      selectedPlan === key 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'border-muted'
                    }`}
                    onClick={() => setSelectedPlan(key as 'monthly' | 'yearly')}
                    data-testid={`plan-${key}`}
                  >
                    <CardContent className="p-4 text-center">
                      {plan.savings && (
                        <Badge className="mb-2 bg-green-500 text-white border-0">
                          {plan.savings}
                        </Badge>
                      )}
                      <div className="text-2xl font-bold mb-1">
                        {plan.price}
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        per {plan.period}
                      </div>
                      {selectedPlan === key && (
                        <div className="flex items-center justify-center text-primary">
                          <Check className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start h-12 bg-blue-600 hover:bg-blue-700 text-white border-0"
                  onClick={() => onSubscribe(selectedPlan)}
                  data-testid="button-paypal-subscribe"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">P</span>
                    </div>
                    <span className="font-semibold">PayPal</span>
                  </div>
                  <div className="ml-auto">
                    {plans[selectedPlan].price}/{plans[selectedPlan].period}
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-12"
                  onClick={() => console.log('MonCash payment - coming soon')}
                  data-testid="button-moncash-subscribe"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5" />
                    <span>MonCash</span>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">
                    Coming Soon
                  </div>
                </Button>
              </div>
              
              <Separator />
              
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>• Cancel anytime in your account settings</p>
                <p>• Auto-renewal can be turned off</p>
                <p>• No hidden fees or charges</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}