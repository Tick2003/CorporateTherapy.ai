import { createClient } from '@supabase/supabase-js';

// Get environment variables with validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client with validated environment variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadAudio(file: File) {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('audio-boosts')
    .upload(fileName, file);
    
  if (error) {
    throw error;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('audio-boosts')
    .getPublicUrl(fileName);
    
  return publicUrl;
}