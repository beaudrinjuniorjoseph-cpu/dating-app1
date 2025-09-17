import ChatInterface from '../ChatInterface';
import profilePhoto1 from '@assets/generated_images/Profile_photo_woman_5e08a65b.png';

// todo: remove mock functionality
const mockProfile = {
  id: '1',
  name: 'Emma',
  age: 26,
  distance: 3,
  bio: 'Love hiking and good coffee',
  interests: ['Travel', 'Photography'],
  photos: [profilePhoto1],
  isVerified: true
};

const mockMessages = [
  {
    id: '1',
    senderId: '1',
    content: 'Hey! Thanks for the match! 😊',
    timestamp: new Date(Date.now() - 3600000),
    type: 'text' as const
  },
  {
    id: '2',
    senderId: 'currentUser',
    content: 'Hi Emma! I love your photos from your hiking trip!',
    timestamp: new Date(Date.now() - 3300000),
    type: 'text' as const
  },
  {
    id: '3',
    senderId: '1',
    content: 'Thank you! Do you like hiking too? 🏔️',
    timestamp: new Date(Date.now() - 3000000),
    type: 'text' as const
  },
  {
    id: '4',
    senderId: 'currentUser',
    content: 'Voice message',
    timestamp: new Date(Date.now() - 2700000),
    type: 'voice' as const,
    duration: 3
  },
  {
    id: '5',
    senderId: '1',
    content: 'That sounds amazing! We should plan a hike together sometime ⛰️',
    timestamp: new Date(Date.now() - 300000),
    type: 'text' as const
  }
];

export default function ChatInterfaceExample() {
  return (
    <div className="h-screen bg-background">
      <ChatInterface 
        profile={mockProfile}
        messages={mockMessages}
        currentUserId="currentUser"
        onSendMessage={(content, type) => console.log('Send message:', { content, type })}
        onBack={() => console.log('Back to matches')}
      />
    </div>
  );
}