import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Mic, MicOff, Smile, MoreVertical, Phone, Video } from "lucide-react";
import { Profile } from "./SwipeCard";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'emoji';
  voiceUrl?: string;
  duration?: number;
}

interface ChatInterfaceProps {
  profile: Profile;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, type: 'text' | 'voice') => void;
  onBack: () => void;
}

export default function ChatInterface({ 
  profile, 
  messages, 
  currentUserId, 
  onSendMessage, 
  onBack 
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😊', '😂', '❤️', '😍', '🔥', '👍', '😘', '🥰', '😎', '🤔', '😱', '🎉'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage, 'text');
      setNewMessage('');
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      // todo: remove mock functionality - implement actual voice recording
      setTimeout(() => {
        setIsRecording(false);
        onSendMessage('Voice message', 'voice');
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-background">
      {/* Header */}
      <CardHeader className="flex flex-row items-center space-y-0 p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          data-testid="button-back-chat"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center space-x-3 flex-1 ml-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile.photos[0]} />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold" data-testid="text-chat-partner-name">
                {profile.name}
              </h3>
              {profile.isVerified && (
                <Badge variant="secondary" className="text-xs">✓</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" data-testid="button-voice-call">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-video-call">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-chat-options">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      
      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId;
          return (
            <div 
              key={message.id} 
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${message.id}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                isOwn 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {message.type === 'voice' ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="w-20 h-1 bg-primary/30 rounded-full">
                        <div className="w-8 h-1 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-xs opacity-70">0:03</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <p className={`text-xs mt-1 opacity-70`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </CardContent>
      
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="px-4 py-2 border-t">
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="text-xl hover:bg-muted"
                onClick={() => handleEmojiClick(emoji)}
                data-testid={`button-emoji-${emoji}`}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            data-testid="button-emoji-picker"
          >
            <Smile className="w-5 h-5" />
          </Button>
          
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            data-testid="input-chat-message"
          />
          
          {newMessage.trim() ? (
            <Button 
              size="icon" 
              onClick={handleSend}
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant={isRecording ? "destructive" : "ghost"}
              onClick={handleVoiceRecord}
              data-testid="button-voice-record"
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          )}
        </div>
        
        {isRecording && (
          <div className="mt-2 flex items-center justify-center space-x-2 text-destructive">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-sm">Recording...</span>
          </div>
        )}
      </div>
    </div>
  );
}