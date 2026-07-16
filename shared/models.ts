import type { Model } from './types';

// Model ids persisted in conversation settings (and submitted by stale
// clients) outlive the picker catalog. Map retired ids to their successors
// so old conversations keep resolving to a routable, correctly priced model.
export const LEGACY_MODEL_IDS: Record<string, Model> = {
  'openai/gpt-5.5': 'openai/gpt-5.6-sol',
  // Gemini 3.1 Pro is unavailable to this app's local-development key. Keep
  // conversations created before the local default changed from retrying it.
  'google/gemini-3.1-pro-preview': 'google/gemini-3.5-flash',
};

export function normalizeModelId(model: Model): Model {
  return LEGACY_MODEL_IDS[model] ?? model;
}
