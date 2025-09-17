import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - core user data
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  isVIP: boolean("is_vip").default(false).notNull(),
  vipExpiresAt: timestamp("vip_expires_at"),
});

// Profiles table - detailed profile information
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  bio: text("bio"),
  gender: text("gender").notNull(), // 'man', 'woman', 'non-binary'
  lookingFor: text("looking_for").notNull(), // 'serious', 'casual', 'friends', 'unsure'
  interests: jsonb("interests").$type<string[]>().default([]).notNull(),
  photos: jsonb("photos").$type<string[]>().default([]).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  city: text("city"),
  maxDistance: integer("max_distance").default(50).notNull(), // km
  ageRangeMin: integer("age_range_min").default(18).notNull(),
  ageRangeMax: integer("age_range_max").default(99).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Swipes table - track all swipe actions
export const swipes = pgTable("swipes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  swiperId: uuid("swiper_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  swipedId: uuid("swiped_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isLike: boolean("is_like").notNull(), // true for like, false for dislike
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueSwipe: sql`UNIQUE(${table.swiperId}, ${table.swipedId})`,
  noSelfSwipe: sql`CHECK(${table.swiperId} != ${table.swipedId})`,
}));

// Matches table - mutual likes
export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user1Id: uuid("user1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  user2Id: uuid("user2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastMessageAt: timestamp("last_message_at"),
}, (table) => ({
  uniqueMatch: sql`UNIQUE(${table.user1Id}, ${table.user2Id})`,
  noSelfMatch: sql`CHECK(${table.user1Id} != ${table.user2Id})`,
  orderedUsers: sql`CHECK(${table.user1Id} < ${table.user2Id})`,
}));

// Messages table - chat messages
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: uuid("match_id").notNull().references(() => matches.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  messageType: text("message_type").default("text").notNull(), // 'text', 'voice', 'image'
  voiceUrl: text("voice_url"),
  voiceDuration: integer("voice_duration"), // seconds
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscriptions table - VIP subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planType: text("plan_type").notNull(), // 'monthly', 'yearly'
  amount: integer("amount").notNull(), // cents
  currency: text("currency").default("USD").notNull(),
  paypalSubscriptionId: text("paypal_subscription_id"),
  status: text("status").notNull(), // 'active', 'cancelled', 'expired'
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  sentSwipes: many(swipes, { relationName: "swiper" }),
  receivedSwipes: many(swipes, { relationName: "swiped" }),
  matches1: many(matches, { relationName: "user1" }),
  matches2: many(matches, { relationName: "user2" }),
  sentMessages: many(messages),
  subscriptions: many(subscriptions),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const swipesRelations = relations(swipes, ({ one }) => ({
  swiper: one(users, {
    fields: [swipes.swiperId],
    references: [users.id],
    relationName: "swiper",
  }),
  swiped: one(users, {
    fields: [swipes.swipedId],
    references: [users.id],
    relationName: "swiped",
  }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  user1: one(users, {
    fields: [matches.user1Id],
    references: [users.id],
    relationName: "user1",
  }),
  user2: one(users, {
    fields: [matches.user2Id],
    references: [users.id],
    relationName: "user2",
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  match: one(matches, {
    fields: [messages.matchId],
    references: [matches.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastActiveAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  interests: z.array(z.string()).default([]),
  photos: z.array(z.string()).default([]),
});

export const insertSwipeSchema = createInsertSchema(swipes).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
  lastMessageAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Swipe = typeof swipes.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertSwipe = z.infer<typeof insertSwipeSchema>;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

// Combined types for API responses
export type ProfileWithUser = Profile & {
  user: User;
};

export type MatchWithProfiles = Match & {
  user1: { profile: Profile };
  user2: { profile: Profile };
};

export type MessageWithSender = Message & {
  sender: { profile: Profile };
};
