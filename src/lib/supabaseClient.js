import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jsvqmpdwazbyprvifepl.supabase.co';
const supabaseKey = 'sb_publishable_7XKo6cF3na3wfKsQSBQUOg_dRvQ0QB6';

export const supabase = createClient(supabaseUrl, supabaseKey);

