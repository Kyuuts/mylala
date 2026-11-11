import { createClient } from '@supabase/supabase-js';
import { MOCK_MODULES, MOCK_FLASHCARDS } from '../src/services/mockData.js';

const url = 'https://rnbdddalidngbigucjqx.supabase.co';
const key = 'sb_publishable_wYyJKnqNrHdHDQxk-T-v6w_VXzMsMy1';

const supabase = createClient(url, key);

async function seed() {
  console.log('Syncing starter modules to Supabase...');

  // Target the 3 starter modules
  const starterModuleIds = ['mod-starter-svo', 'mod-starter-tenses', 'mod-starter-conversation'];
  const modulesToSeed = MOCK_MODULES.filter((m) => starterModuleIds.includes(m.id));
  const cardsToSeed = MOCK_FLASHCARDS.filter((c) => starterModuleIds.includes(c.module_id));

  for (const mod of modulesToSeed) {
    const { error } = await supabase.from('modules').upsert({
      id: mod.id,
      category: mod.category,
      title: mod.title,
      content_markdown: mod.content_markdown,
      created_at: mod.created_at,
    });
    if (error) {
      console.warn(`Could not upsert module ${mod.id}:`, error.message);
    } else {
      console.log(`✓ Module synced: ${mod.title}`);
    }
  }

  for (const card of cardsToSeed) {
    const { error } = await supabase.from('flashcards').upsert({
      id: card.id,
      module_id: card.module_id,
      front_text: card.front_text,
      back_text: card.back_text,
      example_sentence: card.example_sentence,
    });
    if (error) {
      console.warn(`Could not upsert card ${card.id}:`, error.message);
    } else {
      console.log(`✓ Card synced: ${card.id}`);
    }
  }

  console.log('Finished sync check.');
}

seed().catch(console.error);

