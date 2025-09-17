import { useState } from 'react';
import Navigation from '../Navigation';

export default function NavigationExample() {
  const [activeTab, setActiveTab] = useState('discover');
  
  return (
    <div className="h-screen bg-background relative">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Navigation Demo</h2>
          <p className="text-muted-foreground">
            Current tab: <span className="font-semibold text-primary">{activeTab}</span>
          </p>
        </div>
      </div>
      
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadMessages={3}
        newMatches={2}
      />
    </div>
  );
}