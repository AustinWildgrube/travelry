export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      account: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
      };
      account_stat: {
        Row: {
          account_id: string;
          created_at: string;
          followers_count: number;
          following_count: number;
          id: number;
          last_post_at: string | null;
          trip_count: number;
          updated_at: string;
        };
        Insert: {
          account_id: string;
          created_at?: string;
          followers_count?: number;
          following_count?: number;
          id?: number;
          last_post_at?: string | null;
          trip_count?: number;
          updated_at?: string;
        };
        Update: {
          account_id?: string;
          created_at?: string;
          followers_count?: number;
          following_count?: number;
          id?: number;
          last_post_at?: string | null;
          trip_count?: number;
          updated_at?: string;
        };
      };
      album: {
        Row: {
          account_id: string;
          cover: string | null;
          created_at: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          account_id: string;
          cover?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Update: {
          account_id?: string;
          cover?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
      };
      comment: {
        Row: {
          account_id: string;
          created_at: string;
          deleted_at: string | null;
          id: number;
          in_reply_to_comment_id: number | null;
          post_id: string;
          reply: boolean;
          text: string;
          updated_at: string | null;
        };
        Insert: {
          account_id: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          in_reply_to_comment_id?: number | null;
          post_id: string;
          reply?: boolean;
          text: string;
          updated_at?: string | null;
        };
        Update: {
          account_id?: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          in_reply_to_comment_id?: number | null;
          post_id?: string;
          reply?: boolean;
          text?: string;
          updated_at?: string | null;
        };
      };
      follow: {
        Row: {
          account_id: string;
          created_at: string;
          id: number;
          target_account_id: string;
          updated_at: string;
        };
        Insert: {
          account_id: string;
          created_at?: string;
          id?: number;
          target_account_id: string;
          updated_at?: string;
        };
        Update: {
          account_id?: string;
          created_at?: string;
          id?: number;
          target_account_id?: string;
          updated_at?: string;
        };
      };
      like: {
        Row: {
          account_id: string;
          created_at: string;
          id: number;
          post_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          account_id: string;
          created_at?: string;
          id?: number;
          post_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          account_id?: string;
          created_at?: string;
          id?: number;
          post_id?: string | null;
          updated_at?: string | null;
        };
      };
      post: {
        Row: {
          account_id: string;
          album_id: string;
          caption: string | null;
          created_at: string | null;
          deleted_at: string | null;
          id: string;
          location: string | null;
          sensitive: boolean | null;
          updated_at: string | null;
          visibility: number | null;
        };
        Insert: {
          account_id: string;
          album_id: string;
          caption?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: string;
          location?: string | null;
          sensitive?: boolean | null;
          updated_at?: string | null;
          visibility?: number | null;
        };
        Update: {
          account_id?: string;
          album_id?: string;
          caption?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: string;
          location?: string | null;
          sensitive?: boolean | null;
          updated_at?: string | null;
          visibility?: number | null;
        };
      };
      post_media: {
        Row: {
          account_id: string;
          created_at: string | null;
          file_url: string;
          id: string;
          post_id: string;
          updated_at: string | null;
        };
        Insert: {
          account_id: string;
          created_at?: string | null;
          file_url: string;
          id?: string;
          post_id: string;
          updated_at?: string | null;
        };
        Update: {
          account_id?: string;
          created_at?: string | null;
          file_url?: string;
          id?: string;
          post_id?: string;
          updated_at?: string | null;
        };
      };
      post_stat: {
        Row: {
          comments_count: number;
          created_at: string;
          id: number;
          likes_count: number;
          post_id: string;
          updated_at: string | null;
        };
        Insert: {
          comments_count?: number;
          created_at?: string;
          id?: number;
          likes_count?: number;
          post_id: string;
          updated_at?: string | null;
        };
        Update: {
          comments_count?: number;
          created_at?: string;
          id?: number;
          likes_count?: number;
          post_id?: string;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
