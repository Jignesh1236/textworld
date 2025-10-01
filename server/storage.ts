
import { type TextEntry, type InsertTextEntry } from "@shared/schema";
import { supabase } from "../shared/supabase";

export interface IStorage {
  getAllTextEntries(): Promise<TextEntry[]>;
  createTextEntry(entry: InsertTextEntry): Promise<TextEntry>;
}

export class SupabaseStorage implements IStorage {
  async getAllTextEntries(): Promise<TextEntry[]> {
    const { data, error } = await supabase
      .from('text_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching text entries:', error);
      throw new Error('Failed to fetch text entries');
    }

    return data || [];
  }

  async createTextEntry(insertEntry: InsertTextEntry): Promise<TextEntry> {
    const { data, error } = await supabase
      .from('text_entries')
      .insert([{
        content: insertEntry.content,
        x: insertEntry.x,
        y: insertEntry.y
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating text entry:', error);
      throw new Error('Failed to create text entry');
    }

    return data;
  }
}

// Fallback to memory storage if Supabase is not configured
export class MemStorage implements IStorage {
  private textEntries: Map<string, TextEntry>;

  constructor() {
    this.textEntries = new Map();
  }

  async getAllTextEntries(): Promise<TextEntry[]> {
    return Array.from(this.textEntries.values());
  }

  async createTextEntry(insertEntry: InsertTextEntry): Promise<TextEntry> {
    const { randomUUID } = await import("crypto");
    const id = randomUUID();
    const entry: TextEntry = { 
      ...insertEntry, 
      id, 
      createdAt: new Date() 
    };
    this.textEntries.set(id, entry);
    return entry;
  }
}

// Use Supabase storage if environment variables are set, otherwise fallback to memory
const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;
export const storage = useSupabase ? new SupabaseStorage() : new MemStorage();
