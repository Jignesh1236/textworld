import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabase } from "../shared/supabase";
import { storage } from "./storage";
import { insertTextEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Supabase auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password } = req.body;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ user: data.user, session: data.session });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ user: data.user, session: data.session });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/signout", async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ message: "Signed out successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all text entries
  app.get('/api/text-entries', async (req, res) => {
    try {
      const entries = await storage.getAllTextEntries();
      res.json(entries);
    } catch (error) {
      console.error('Error fetching text entries:', error);
      res.status(500).json({ error: 'Failed to fetch text entries' });
    }
  });

  // Create new text entry
  app.post('/api/text-entries', async (req, res) => {
    try {
      const validatedData = insertTextEntrySchema.parse(req.body);
      const entry = await storage.createTextEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      console.error('Error creating text entry:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({ error: 'Invalid data format' });
      } else {
        res.status(500).json({ error: 'Failed to create text entry' });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}