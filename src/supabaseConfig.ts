// src/supabaseConfig.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wsvlxvkgvapiiqshrojk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indzdmx4dmtndmFwaWlxc2hyb2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0NzQyMjAsImV4cCI6MjA0NjA1MDIyMH0.pc9ge2wq5UkTRnwc3ihBuFF_sscV_V2UZcU4CEFB4qQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
