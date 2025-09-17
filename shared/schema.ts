import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - core user data
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  lastActiveAt: integer("last_active_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
  isVIP: integer("is_vip", { mode: 'boolean' }).default(false).notNull(),
  vipExpiresAt: integer("vip_expires_at", { mode: 'timestamp' }),
});

// Profiles table - detailed profile information
export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  bio: text("bio"),
  gender: text("gender").notNull(), // 'man', 'woman', 'non-binary'
  lookingFor: text("looking_for").notNull(), // 'serious', 'casual', 'friends', 'unsure'
  interests: text("interests", { mode: 'json' }).$type<string[]>().default(sql`'[]'`).notNull(),
  photos: text("photos", { mode: 'json' }).$type<string[]>().default(sql`'[]'`).notNull(),
  isVerified: integer("is_verified", { mode: 'boolean' }).default(false).notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  city: text("city"),
  maxDistance: integer("max_distance").default(50).notNull(), // km
  ageRangeMin: integer("age_range_min").default(18).notNull(),
  ageRangeMax: integer("age_range_max").default(99).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

// Swipes table - track all swipe actions
export const swipes = sqliteTable("swipes", {
  id: text("id").primaryKey(),
  swiperId: text("swiper_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  swipedId: text("swiped_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isLike: integer("is_like", { mode: 'boolean' }).notNull(), // true for like, false for dislike
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

// Matches table - mutual likes
export const matches = sqliteTable("matches", {
  id: text("id").primaryKey(),
  user1Id: text("user1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  user2Id: text("user2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  lastMessageAt: integer("last_message_at", { mode: 'timestamp' }),
});

// Messages table - chat messages
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  matchId: text("match_id").notNull().references(() => matches.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  messageType: text("message_type").default("text").notNull(), // 'text', 'voice', 'image'
  voiceUrl: text("voice_url"),
  voiceDuration: integer("voice_duration"), // seconds
  isRead: integer("is_read", { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

// Subscriptions table - VIP subscriptions
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planType: text("plan_type").notNull(), // 'monthly', 'yearly'
  amount: integer("amount").notNull(), // cents
  currency: text("currency").default("USD").notNull(),
  paypalSubscriptionId: text("paypal_subscription_id"),
  status: text("status").notNull(), // 'active', 'cancelled', 'expired'
  startsAt: integer("starts_at", { mode: 'timestamp' }).notNull(),
  endsAt: integer("ends_at", { mode: 'timestamp' }).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
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
