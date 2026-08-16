/**
 * Database types generated from the live schema.
 *
 * Regenerate after any migration with:
 *   npx supabase gen types typescript --project-id <your-project-ref> > lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      booking_requests: {
        Row: {
          check_in: string | null;
          check_out: string | null;
          created_at: string;
          email: string;
          full_name: string;
          guests: number;
          id: string;
          listing_id: string;
          listing_kind: Database["public"]["Enums"]["listing_kind"];
          message: string | null;
          total_price: number | null;
        };
        Insert: {
          check_in?: string | null;
          check_out?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          guests?: number;
          id?: string;
          listing_id: string;
          listing_kind: Database["public"]["Enums"]["listing_kind"];
          message?: string | null;
          total_price?: number | null;
        };
        Update: {
          check_in?: string | null;
          check_out?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          guests?: number;
          id?: string;
          listing_id?: string;
          listing_kind?: Database["public"]["Enums"]["listing_kind"];
          message?: string | null;
          total_price?: number | null;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          badge: string | null;
          category: string;
          city: string;
          country: string;
          created_at: string;
          description: string;
          duration_hours: number;
          group_size: number;
          highlights: string[];
          host_id: string;
          id: string;
          images: string[];
          included: string[];
          is_original: boolean;
          languages: string[];
          meeting_point: string;
          minimum_spend: number | null;
          price: number;
          price_unit: Database["public"]["Enums"]["pricing_unit"];
          rating: number;
          review_count: number;
          start_time: string | null;
          title: string;
        };
        Insert: {
          badge?: string | null;
          category: string;
          city: string;
          country: string;
          created_at?: string;
          description: string;
          duration_hours: number;
          group_size: number;
          highlights?: string[];
          host_id: string;
          id: string;
          images?: string[];
          included?: string[];
          is_original?: boolean;
          languages?: string[];
          meeting_point?: string;
          minimum_spend?: number | null;
          price: number;
          price_unit?: Database["public"]["Enums"]["pricing_unit"];
          rating: number;
          review_count?: number;
          start_time?: string | null;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["experiences"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "experiences_host_id_fkey";
            columns: ["host_id"];
            isOneToOne: false;
            referencedRelation: "hosts";
            referencedColumns: ["id"];
          },
        ];
      };
      homes: {
        Row: {
          amenities: Json;
          area: string;
          badge: string | null;
          bathrooms: number;
          bedrooms: number;
          beds: number;
          city: string;
          country: string;
          created_at: string;
          description: string;
          guests: number;
          host_id: string;
          house_rules: string[];
          id: string;
          images: string[];
          lat: number;
          lng: number;
          name: string;
          nights: number;
          place_type: Database["public"]["Enums"]["place_type"];
          price: number;
          property_type: string;
          rating: number;
          review_count: number;
          sleeping: Json;
          tags: string[];
          title: string;
        };
        Insert: {
          amenities?: Json;
          area: string;
          badge?: string | null;
          bathrooms: number;
          bedrooms: number;
          beds: number;
          city: string;
          country: string;
          created_at?: string;
          description: string;
          guests: number;
          host_id: string;
          house_rules?: string[];
          id: string;
          images?: string[];
          lat: number;
          lng: number;
          name: string;
          nights?: number;
          place_type?: Database["public"]["Enums"]["place_type"];
          price: number;
          property_type: string;
          rating: number;
          review_count?: number;
          sleeping?: Json;
          tags?: string[];
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["homes"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "homes_host_id_fkey";
            columns: ["host_id"];
            isOneToOne: false;
            referencedRelation: "hosts";
            referencedColumns: ["id"];
          },
        ];
      };
      hosts: {
        Row: {
          about: string;
          avatar: string;
          created_at: string;
          id: string;
          is_superhost: boolean;
          name: string;
          response_rate: number;
          years_hosting: number;
        };
        Insert: {
          about?: string;
          avatar: string;
          created_at?: string;
          id: string;
          is_superhost?: boolean;
          name: string;
          response_rate?: number;
          years_hosting?: number;
        };
        Update: Partial<Database["public"]["Tables"]["hosts"]["Insert"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          author: string;
          avatar: string;
          body: string;
          created_at: string;
          id: string;
          listing_id: string;
          listing_kind: Database["public"]["Enums"]["listing_kind"];
          rating: number;
          review_date: string;
        };
        Insert: {
          author: string;
          avatar: string;
          body: string;
          created_at?: string;
          id?: string;
          listing_id: string;
          listing_kind: Database["public"]["Enums"]["listing_kind"];
          rating: number;
          review_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [];
      };
      services: {
        Row: {
          badge: string | null;
          category: string;
          city: string;
          country: string;
          created_at: string;
          description: string;
          duration_minutes: number;
          host_id: string;
          id: string;
          images: string[];
          includes: string[];
          minimum_spend: number | null;
          price: number;
          price_unit: Database["public"]["Enums"]["pricing_unit"];
          provider: string;
          rating: number;
          review_count: number;
          title: string;
        };
        Insert: {
          badge?: string | null;
          category: string;
          city: string;
          country: string;
          created_at?: string;
          description: string;
          duration_minutes: number;
          host_id: string;
          id: string;
          images?: string[];
          includes?: string[];
          minimum_spend?: number | null;
          price: number;
          price_unit?: Database["public"]["Enums"]["pricing_unit"];
          provider: string;
          rating: number;
          review_count?: number;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "services_host_id_fkey";
            columns: ["host_id"];
            isOneToOne: false;
            referencedRelation: "hosts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      listing_kind: "home" | "experience" | "service";
      place_type: "entire" | "room" | "shared";
      pricing_unit: "guest" | "group";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];

export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];
