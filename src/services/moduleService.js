import { supabase, isSupabaseConfigured } from './supabase';
import { storageService } from './storageService';
import { MOCK_MODULES } from './mockData';

export const moduleService = {
  /**
   * Fetch all modules, optionally filtered by category ('Grammar', 'Vocab', 'Templates')
   */
  async getModules(category = null) {
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        let query = supabase
          .from('modules')
          .select('id, category, title, content_markdown, created_at')
          .order('created_at', { ascending: true });

        if (category && category !== 'All') {
          query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) throw error;

        if (data && data.length > 0) {
          // Cache to local storage for offline PWA access
          storageService.setModules(data);
          return { data, error: null, source: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase fetch modules failed, falling back to cache:', err.message);
      }
    }

    // Offline / Fallback handling
    const cached = storageService.getModules();
    let result = cached && cached.length > 0 ? cached : MOCK_MODULES;

    if (category && category !== 'All') {
      result = result.filter((m) => m.category === category);
    }

    return { data: result, error: null, source: 'offline-cache' };
  },

  /**
   * Fetch a single module by ID
   */
  async getModuleById(id) {
    if (!id) return { data: null, error: new Error('Module ID is required') };

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('modules')
          .select('id, category, title, content_markdown, created_at')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) return { data, error: null, source: 'supabase' };
      } catch (err) {
        console.warn('Supabase getModuleById failed, checking cache:', err.message);
      }
    }

    // Check cached or mock
    const cachedModules = storageService.getModules() || MOCK_MODULES;
    const found = cachedModules.find((m) => m.id === id);

    if (found) {
      return { data: found, error: null, source: 'offline-cache' };
    }

    return { data: null, error: new Error('Module not found'), source: 'none' };
  },

  /**
   * Create a new module
   */
  async createModule({ category, title, content_markdown }) {
    if (!category || !title || !content_markdown) {
      return { data: null, error: new Error('Category, title, and content_markdown are required') };
    }

    if (isSupabaseConfigured() && navigator.onLine) {
      const { data, error } = await supabase
        .from('modules')
        .insert([{ category, title, content_markdown }])
        .select()
        .single();

      return { data, error };
    }

    // Local / Offline fallback creation
    const newModule = {
      id: `local-mod-${Date.now()}`,
      category,
      title,
      content_markdown,
      created_at: new Date().toISOString(),
    };

    const modules = storageService.getModules() || [...MOCK_MODULES];
    modules.push(newModule);
    storageService.setModules(modules);

    return { data: newModule, error: null, source: 'local' };
  },
};

