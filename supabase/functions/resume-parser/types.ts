/// <reference lib="deno.ns" />

// Type declarations for Supabase client
declare module "@supabase/supabase-js" {
  export interface SupabaseClient {
    storage: {
      from: (bucket: string) => {
        download: (path: string) => Promise<{
          data: Blob | null;
          error: Error | null;
        }>;
      };
    };
  }

  export function createClient(
    supabaseUrl: string,
    supabaseKey: string
  ): SupabaseClient;
}

// Resume parser types
export interface ResumeParserRequest {
  filePath: string;
}

export interface ExtractedResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    summary: string;
  };
  workExperience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  skills: string[];
  achievements: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

// Deno types
declare global {
  interface Request {
    method: string;
    json(): Promise<any>;
  }
}

// Error type
export interface ApiError {
  message: string;
} 