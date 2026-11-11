import { createClient } from '@supabase/supabase-js';

const url = 'https://rnbdddalidngbigucjqx.supabase.co';
const key = 'sb_publishable_wYyJKnqNrHdHDQxk-T-v6w_VXzMsMy1';

console.log('Testing connection to Supabase project...');
const supabase = createClient(url, key);

async function test() {
  try {
    const { data, error } = await supabase.from('modules').select('id, title, category');
    if (error) {
      console.log('⚠️ Supabase responded with error:', error.message);
      if (error.code === '42P01') {
        console.log('👉 Table "modules" does not exist yet. You need to run supabase_schema.sql in Supabase SQL Editor!');
      }
    } else {
      console.log(`✅ Supabase Connection SUCCESS! Found ${data.length} modules in cloud database:`);
      data.forEach((m) => console.log(`   - [${m.category}] ${m.title} (${m.id})`));
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

test();

