import { 
  users, 
  profiles, 
  swipes, 
  matches, 
  messages,
  subscriptions,
  type User, 
  type Profile,
  type Swipe,
  type Match,
  type Message,
  type Subscription,
  type InsertUser,
  type InsertProfile,
  type InsertSwipe,
  type InsertMatch,
  type InsertMessage,
  type InsertSubscription,
  type ProfileWithUser,
  type MatchWithProfiles,
  type MessageWithSender
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, sql, desc, asc } from "drizzle-orm";

// Storage interface with all CRUD methods needed for dating app
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Profile operations
  getProfile(userId: string): Promise<Profile | undefined>;
  getProfileWithUser(userId: string): Promise<ProfileWithUser | undefined>;
  createProfile(profile: InsertProfile & { userId: string }): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined>;
  getDiscoveryProfiles(userId: string, limit?: number): Promise<ProfileWithUser[]>;
  
  // Swipe operations
  createSwipe(swipe: InsertSwipe): Promise<Swipe>;
  getSwipe(swiperId: string, swipedId: string): Promise<Swipe | undefined>;
  getUserLikes(userId: string): Promise<ProfileWithUser[]>;
  
  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
  getUserMatches(userId: string): Promise<MatchWithProfiles[]>;
  getMatch(user1Id: string, user2Id: string): Promise<Match | undefined>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMatchMessages(matchId: string): Promise<MessageWithSender[]>;
  markMessagesAsRead(matchId: string, userId: string): Promise<void>;
  
  // Subscription operations
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getUserActiveSubscription(userId: string): Promise<Subscription | undefined>;
  updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userWithId = {
      ...insertUser,
      id: crypto.randomUUID()
    };
    const [user] = await db.insert(users).values(userWithId).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Profile operations
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile || undefined;
  }

  async getProfileWithUser(userId: string): Promise<ProfileWithUser | undefined> {
    const [result] = await db
      .select()
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.userId, userId));
    
    if (!result) return undefined;
    
    return {
      ...result.profiles,
      user: result.users
    };
  }

  async createProfile(profile: InsertProfile & { userId: string }): Promise<Profile> {
    const row = {
      ...profile,
      id: crypto.randomUUID(),
      userId: profile.userId,
      interests: profile.interests ?? [],
      photos: profile.photos ?? []
    };
    const [newProfile] = await db.insert(profiles).values(row).returning();
    return newProfile;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined> {
    const [profile] = await db
      .update(profiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  async getDiscoveryProfiles(userId: string, limit = 10): Promise<ProfileWithUser[]> {
    // Get profiles excluding:
    // 1. Current user
    // 2. Users already swiped on
    // 3. Order by creation date (could add more sophisticated algorithm later)
    const results = await db
      .select()
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(
        and(
          sql`${profiles.userId} != ${userId}`,
          sql`${profiles.userId} NOT IN (
            SELECT ${swipes.swipedId} 
            FROM ${swipes} 
            WHERE ${swipes.swiperId} = ${userId}
          )`
        )
      )
      .orderBy(desc(profiles.createdAt))
      .limit(limit);
    
    return results.map(result => ({
      ...result.profiles,
      user: result.users
    }));
  }

  // Swipe operations
  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    const swipeWithId = {
      ...swipe,
      id: crypto.randomUUID()
    };
    const [newSwipe] = await db.insert(swipes).values(swipeWithId).returning();
    return newSwipe;
  }

  async getSwipe(swiperId: string, swipedId: string): Promise<Swipe | undefined> {
    const [swipe] = await db
      .select()
      .from(swipes)
      .where(and(eq(swipes.swiperId, swiperId), eq(swipes.swipedId, swipedId)));
    return swipe || undefined;
  }

  async getUserLikes(userId: string): Promise<ProfileWithUser[]> {
    // Get profiles of users who liked this user
    const results = await db
      .select()
      .from(swipes)
      .innerJoin(profiles, eq(swipes.swiperId, profiles.userId))
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(and(eq(swipes.swipedId, userId), eq(swipes.isLike, true)))
      .orderBy(desc(swipes.createdAt));
    
    return results.map(result => ({
      ...result.profiles,
      user: result.users
    }));
  }

  // Match operations
  async createMatch(match: InsertMatch): Promise<Match> {
    // Ensure user1Id is always the smaller UUID to prevent duplicates
    const [smallerId, largerId] = [match.user1Id, match.user2Id].sort();
    const orderedMatch = {
      ...match,
      id: crypto.randomUUID(),
      user1Id: smallerId,
      user2Id: largerId,
    };
    const [newMatch] = await db.insert(matches).values(orderedMatch).returning();
    return newMatch;
  }

  async getUserMatches(userId: string): Promise<MatchWithProfiles[]> {
    const results = await db
      .select()
      .from(matches)
      .innerJoin(users, or(eq(matches.user1Id, users.id), eq(matches.user2Id, users.id)))
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(or(eq(matches.user1Id, userId), eq(matches.user2Id, userId)))
      .orderBy(desc(matches.createdAt));
    
    // Group by match and construct proper response
    const matchMap = new Map<string, any>();
    
    for (const result of results) {
      const matchId = result.matches.id;
      if (!matchMap.has(matchId)) {
        matchMap.set(matchId, {
          ...result.matches,
          user1: { profile: null },
          user2: { profile: null }
        });
      }
      
      const match = matchMap.get(matchId);
      if (result.users.id === match.user1Id) {
        match.user1.profile = result.profiles;
      } else {
        match.user2.profile = result.profiles;
      }
    }
    
    return Array.from(matchMap.values());
  }

  async getMatch(user1Id: string, user2Id: string): Promise<Match | undefined> {
    const [match] = await db
      .select()
      .from(matches)
      .where(
        or(
          and(eq(matches.user1Id, user1Id), eq(matches.user2Id, user2Id)),
          and(eq(matches.user1Id, user2Id), eq(matches.user2Id, user1Id))
        )
      );
    return match || undefined;
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const messageWithId = {
      ...message,
      id: crypto.randomUUID()
    };
    const [newMessage] = await db.insert(messages).values(messageWithId).returning();
    
    // Update match's lastMessageAt
    await db
      .update(matches)
      .set({ lastMessageAt: new Date() })
      .where(eq(matches.id, message.matchId));
    
    return newMessage;
  }

  async getMatchMessages(matchId: string): Promise<MessageWithSender[]> {
    const results = await db
      .select()
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(messages.matchId, matchId))
      .orderBy(asc(messages.createdAt));
    
    return results.map(result => ({
      ...result.messages,
      sender: {
        profile: result.profiles
      }
    }));
  }

  async markMessagesAsRead(matchId: string, userId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.matchId, matchId),
          sql`${messages.senderId} != ${userId}`
        )
      );
  }

  // Subscription operations
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const subscriptionWithId = {
      ...subscription,
      id: crypto.randomUUID()
    };
    const [newSubscription] = await db.insert(subscriptions).values(subscriptionWithId).returning();
    return newSubscription;
  }

  async getUserActiveSubscription(userId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active"),
          sql`${subscriptions.endsAt} > NOW()`
        )
      )
      .orderBy(desc(subscriptions.createdAt));
    return subscription || undefined;
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return subscription || undefined;
  }
}

export const storage = new DatabaseStorage();
