import MatchesPage from '../MatchesPage';
import profilePhoto1 from '@assets/generated_images/Profile_photo_woman_5e08a65b.png';
import profilePhoto2 from '@assets/generated_images/Profile_photo_man_e9dc1d86.png';
import profilePhoto3 from '@assets/generated_images/Profile_photo_woman_two_dae67ecf.png';
import profilePhoto4 from '@assets/generated_images/Profile_photo_man_two_b11497d8.png';

// todo: remove mock functionality
const mockMatches = [
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

const mockLikes = [
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

export default function MatchesPageExample() {
  return (
    <div className="min-h-screen bg-background">
      <MatchesPage 
        matches={mockMatches}
        likes={mockLikes}
        onStartChat={(id) => console.log('Start chat with:', id)}
        onUpgradeToVIP={() => console.log('Upgrade to VIP clicked')}
        isVIP={false}
      />
    </div>
  );
}