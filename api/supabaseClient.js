const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Exporta o cliente para ser usado no seu server.js
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;