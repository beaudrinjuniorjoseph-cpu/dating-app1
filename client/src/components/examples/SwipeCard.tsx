import SwipeCard from '../SwipeCard';
import profilePhoto1 from '@assets/generated_images/Profile_photo_woman_5e08a65b.png';
import profilePhoto2 from '@assets/generated_images/Profile_photo_man_e9dc1d86.png';

// todo: remove mock functionality
const mockProfile = {
  id: '1',
  name: 'Emma',
  age: 26,
  distance: 3,
  bio: 'Love hiking, good coffee, and spontaneous adventures. Looking for someone to explore the city with!',
  interests: ['Travel', 'Photography', 'Coffee', 'Hiking', 'Music', 'Books'],
  photos: [profilePhoto1, profilePhoto2],
  isVerified: true
};

export default function SwipeCardExample() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-chart-2/5 flex items-center justify-center p-4">
      <SwipeCard 
        profile={mockProfile}
        onLike={(id) => console.log('Liked profile:', id)}
        onDislike={(id) => console.log('Disliked profile:', id)}
      />
    </div>
  );
}