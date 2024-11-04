import { createClient } from '@supabase/supabase-js';

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = 'https://bgckerfaimtiavllgvuo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnY2tlcmZhaW10aWF2bGxndnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2ODA1MDgsImV4cCI6MjA0NjI1NjUwOH0.rmQ8a-19BZ8gpB_Qysyu_3kvO7Wp-lwsYflyuzWSF6w';

// Criação do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
