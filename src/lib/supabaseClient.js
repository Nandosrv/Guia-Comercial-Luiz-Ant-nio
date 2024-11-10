import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rxkrvqhmfbjbxhwukdct.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4a3J2cWhtZmJqYnhod3VrZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMTU3ODIsImV4cCI6MjA0Njc5MTc4Mn0.ddzMg_3ZpyNEGYKQzRt-TUv0pND33ABedKaZeH50PJA';

export const supabase = createClient(supabaseUrl, supabaseKey);
