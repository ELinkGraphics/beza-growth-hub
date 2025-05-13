
/// <reference types="vite/client" />

// Extend Supabase types to include website_content table
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        website_content: {
          Row: {
            id: string;
            section: string;
            content: any;
            created_at: string | null;
            updated_at: string | null;
          };
          Insert: {
            id?: string;
            section: string;
            content: any;
            created_at?: string | null;
            updated_at?: string | null;
          };
          Update: {
            id?: string;
            section?: string;
            content?: any;
            created_at?: string | null;
            updated_at?: string | null;
          };
        };
      };
    };
  }
}
