import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Heart, Camera } from "lucide-react";

type OnboardingStep = 'gender' | 'age' | 'looking-for' | 'interests' | 'photos';

interface OnboardingData {
  gender: string;
  age: string;
  lookingFor: string;
  interests: string[];
  photos: string[];
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const interests = [
  'Music', 'Travel', 'Photography', 'Fitness', 'Cooking', 'Movies',
  'Books', 'Art', 'Sports', 'Gaming', 'Dancing', 'Hiking',
  'Coffee', 'Wine', 'Yoga', 'Fashion', 'Tech', 'Pets'
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('gender');
  const [data, setData] = useState<OnboardingData>({
    gender: '',
    age: '',
    lookingFor: '',
    interests: [],
    photos: []
  });

  const steps: OnboardingStep[] = ['gender', 'age', 'looking-for', 'interests', 'photos'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    } else {
      onComplete(data);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'gender': return data.gender !== '';
      case 'age': return data.age !== '' && parseInt(data.age) >= 18;
      case 'looking-for': return data.lookingFor !== '';
      case 'interests': return data.interests.length >= 3;
      case 'photos': return true; // Optional step
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-chart-2/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <span className="text-xl font-bold">Spark</span>
          </div>
          <Progress value={progress} className="w-full" />
          <CardTitle className="text-xl">
            {currentStep === 'gender' && 'What\'s your gender?'}
            {currentStep === 'age' && 'How old are you?'}
            {currentStep === 'looking-for' && 'What are you looking for?'}
            {currentStep === 'interests' && 'What are your interests?'}
            {currentStep === 'photos' && 'Add your photos'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStep === 'gender' && (
            <div className="space-y-3">
              {['Woman', 'Man', 'Non-binary'].map((option) => (
                <Button
                  key={option}
                  variant={data.gender === option ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setData(prev => ({ ...prev, gender: option }))}
                  data-testid={`button-gender-${option.toLowerCase()}`}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {currentStep === 'age' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  value={data.age}
                  onChange={(e) => setData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter your age"
                  data-testid="input-age"
                />
              </div>
              {data.age && parseInt(data.age) < 18 && (
                <p className="text-sm text-destructive">You must be 18 or older to use Spark.</p>
              )}
            </div>
          )}

          {currentStep === 'looking-for' && (
            <div className="space-y-3">
              {['Serious relationship', 'Casual dating', 'New friends', 'Not sure yet'].map((option) => (
                <Button
                  key={option}
                  variant={data.lookingFor === option ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setData(prev => ({ ...prev, lookingFor: option }))}
                  data-testid={`button-looking-for-${option.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {currentStep === 'interests' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Select at least 3 interests (selected: {data.interests.length})</p>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={data.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover-elevate"
                    onClick={() => handleInterestToggle(interest)}
                    data-testid={`badge-interest-${interest.toLowerCase()}`}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'photos' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Add photos to show your personality (you can do this later)
                </p>
                <Button variant="outline" className="w-full" data-testid="button-add-photos">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photos
                </Button>
              </div>
            </div>
          )}

          <Button 
            className="w-full"
            onClick={handleNext}
            disabled={!canProceed()}
            data-testid="button-next-step"
          >
            {currentStepIndex === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}