import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { profiles } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const objectStorageService = new ObjectStorageService();

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        user = await storage.createUser({
          email
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.put("/api/users/update", async (req, res) => {
    try {
      const userId = req.headers['user-id'] as string;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const { name, age, bio, interests, photos } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const profileData = {
        userId,
        name: name || 'User',
        age: age || 25,
        bio: bio || '',
        gender: 'non-binary', // Default value
        lookingFor: 'friends', // Default value
        interests: interests || [],
        photos: photos || [],
        isVerified: false
      };
      
      const existingProfile = await db.select()
        .from(profiles)
        .where(eq(profiles.userId, userId))
        .limit(1);
      
      let updatedProfile;
      if (existingProfile.length > 0) {
        [updatedProfile] = await db.update(profiles)
          .set(profileData)
          .where(eq(profiles.userId, userId))
          .returning();
      } else {
        const profileWithId = {
          ...profileData,
          id: crypto.randomUUID()
        };
        [updatedProfile] = await db.insert(profiles)
          .values(profileWithId)
          .returning();
      }
      
      const updatedUser = {
        ...user,
        ...updatedProfile
      };
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  // Messages endpoint
  app.post("/api/messages", async (req, res) => {
    try {
      const { content, type, recipientId } = req.body;
      const senderId = req.headers['user-id'] as string;
      
      if (!senderId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const message = {
        id: Date.now().toString(),
        senderId,
        content,
        type,
        timestamp: new Date(),
        recipientId
      };
      
      res.json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // Serve public assets from object storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      await objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve uploaded objects (profile photos, etc.)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectFile = await objectStorageService.getObjectFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error retrieving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Get upload URL for profile photos
  app.post("/api/upload/url", async (req, res) => {
    try {
      const uploadURL = await objectStorageService.getProfilePhotoUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Upload profile photos directly
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      // Get upload URL
      const uploadURL = await objectStorageService.getProfilePhotoUploadURL();
      
      // Upload file to object storage
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: req.file.buffer,
        headers: {
          'Content-Type': req.file.mimetype,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      // Convert the upload URL to our object URL format
      const objectPath = objectStorageService.normalizeObjectPath(uploadURL);
      
      res.json({ 
        url: objectPath,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Discovery profiles endpoint
  app.get("/api/discovery", async (req, res) => {
    try {
      const currentUserId = req.headers['user-id'] as string;
      if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const limit = parseInt(req.query.limit as string) || 10;
      
      const profiles = await storage.getDiscoveryProfiles(currentUserId, limit);
      
      const transformedProfiles = profiles.map(profile => ({
        id: profile.id,
        name: profile.name,
        age: profile.age,
        distance: Math.floor(Math.random() * 20) + 1,
        bio: profile.bio || '',
        interests: profile.interests,
        photos: profile.photos,
        isVerified: profile.isVerified
      }));
      
      res.json({ profiles: transformedProfiles });
    } catch (error) {
      console.error("Error getting discovery profiles:", error);
      res.status(500).json({ error: "Failed to get discovery profiles" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
