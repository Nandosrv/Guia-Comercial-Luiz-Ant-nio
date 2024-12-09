// import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL  } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

const PUBLIC_SUPABASE_KEY = process.env.PUBLIC_SUPABASE_KEY;
const PUBLIC_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;

const supabase = createClient(PUBLIC_SUPABASE_URL,PUBLIC_SUPABASE_KEY);

export default supabase;
