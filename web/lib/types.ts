export type DangerLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Snake {
  id: string;
  common_name: string;
  scientific_name: string;
  danger_level: DangerLevel;
  venom_type: string;
  color: string;
  accent: string;
  length_range: string;
  description: string;
  habitat: string;
  behavior: string;
  venom_effects: string;
  first_aid: string;
  antivenom_available: boolean;
  endemic_regions: string[];
  image_tags: string[];
}

export interface IdentificationResult {
  identified: boolean;
  snake_id: string | null;
  common_name: string | null;
  scientific_name: string | null;
  confidence: number;
  confidence_label: "High" | "Medium" | "Low";
  danger_level: DangerLevel | null;
  is_snake: boolean;
  reasoning: string;
  visible_features: string[];
  immediate_action: string;
  alternative_matches: Array<{
    snake_id: string;
    common_name: string;
    confidence: number;
  }>;
  snake_data?: Snake;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  specialization: string;
  qualifications: string[];
  experience_years: number;
  location: string;
  languages: string[];
  avatar_initials: string;
  rating: number;
  total_consultations: number;
  available: boolean;
  bio: string;
}

export interface Booking {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  expert_id?: string;
  date: string;
  time_slot: string;
  reason: string;
  location?: string;
  snake_species_concern?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  created_at: string;
}

export interface EmergencyReport {
  description: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  bitten: boolean;
  snake_description?: string;
  user_phone?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  content_type: "article" | "video" | "photo" | "tip";
  body?: string;
  video_url?: string;
  tags: string[];
  snake_species?: string;
  author_name: string;
  is_featured: boolean;
  views: number;
  likes: number;
  created_at: string;
}
