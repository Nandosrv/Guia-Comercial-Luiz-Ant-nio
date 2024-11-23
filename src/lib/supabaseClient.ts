
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wsxmoaqtqsncoaawmuhp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeG1vYXF0cXNuY29hYXdtdWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMDU0NjgsImV4cCI6MjA0Nzg4MTQ2OH0.cL3pGYarT9LhhZZ3JG10lpXyIy8Om_r2T14rCr8xrh4'; 

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
