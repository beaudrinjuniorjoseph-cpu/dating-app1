import VIPPage from '../VIPPage';

export default function VIPPageExample() {
  return (
    <div className="min-h-screen bg-background">
      <VIPPage 
        onBack={() => console.log('Back clicked')}
        onSubscribe={(plan) => console.log('Subscribe to:', plan)}
        isVIP={false}
      />
    </div>
  );
}