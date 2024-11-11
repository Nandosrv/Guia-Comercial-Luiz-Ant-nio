import { createClient } from '@supabase/supabase-js';

// Substitua pela sua URL do Supabase e chave de API
const supabaseUrl = 'https://qkhmpxleibwrtwfphkne.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFraG1weGxlaWJ3cnR3ZnBoa25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyOTU0MzYsImV4cCI6MjA0Njg3MTQzNn0.E9ORJtilqxNFeyudktYXlG8mH2BA_RK_aUGpiyAbFJ4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
