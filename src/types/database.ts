export interface SlamBook {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  theme: string;
  slug: string;
  is_public: boolean;
  password?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  slam_book_id: string;
  type: string; // Changed from union type to string to match Supabase
  question: string;
  required: boolean;
  options?: string[];
  position: number;
  created_at: string;
}

export interface Response {
  id: string;
  slam_book_id: string;
  respondent_name?: string;
  created_at: string;
}

export interface Answer {
  id: string;
  response_id: string;
  question_id: string;
  answer_text?: string;
  answer_number?: number;
  file_url?: string;
  created_at: string;
}
