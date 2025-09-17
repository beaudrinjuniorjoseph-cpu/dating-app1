import ProfilePage from '../ProfilePage';
import profilePhoto1 from '@assets/generated_images/Profile_photo_woman_5e08a65b.png';
import profilePhoto2 from '@assets/generated_images/Profile_photo_man_e9dc1d86.png';

// todo: remove mock functionality
const mockProfile = {
  id: 'current-user',
  name: 'You',
  age: 27,
  distance: 0,
  bio: 'Adventure seeker, coffee lover, and dog person. Always up for trying new restaurants or exploring hiking trails. Looking for someone genuine to share life\'s adventures with!',
  interests: ['Travel', 'Photography', 'Coffee', 'Hiking', 'Music', 'Cooking'],
  photos: [profilePhoto1, profilePhoto2],
  isVerified: true
};

export default function ProfilePageExample() {
  return (
    <div className="min-h-screen bg-background">
      <ProfilePage 
        profile={mockProfile}
        isVIP={false}
        onUpdateProfile={(updates) => console.log('Update profile:', updates)}
        onUpgradeToVIP={() => console.log('Upgrade to VIP clicked')}
        onLogout={() => console.log('Logout clicked')}
      />
    </div>
  );
}