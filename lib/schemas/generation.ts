import { z } from 'zod';

// ============================================
// Directors Arena v2.1 — AI Generation Schemas
// Used with Vercel AI SDK streamObject/generateObject
// ============================================

/**
 * Character output schema — maps to characters_v2 table
 * gender/ageGroup used for avatar mapping
 */
export const CharacterOutputSchema = z.object({
  name: z.string().describe("Character's full name"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).describe("Character gender for avatar mapping"),
  ageGroup: z.enum(["TEEN", "20S", "30S", "40S", "50S_PLUS"]).describe("Age bracket for avatar mapping"),
  role: z.string().describe("Narrative role, e.g. 주인공, 안타고니스트, 조력자"),
  description: z.string().describe("2-3 sentence character description including appearance and personality"),
  relationshipToProtagonist: z.string().describe("How this character relates to the protagonist"),
});

/**
 * Episode output schema — maps to episodes_v2 table
 * scriptContent uses industry-standard screenplay format (plain text)
 */
export const EpisodeOutputSchema = z.object({
  episodeNumber: z.number().describe("Sequential episode number starting from 1"),
  title: z.string().describe("Evocative episode title"),
  summary: z.string().describe("300-word narrative summary of this episode's events"),
  scriptContent: z.string().nullable().describe(
    "Full screenplay in industry-standard plain text format (INT./EXT., character names in CAPS, dialog on next line). " +
    "ONLY generate this for Episode 1. Set to null for all other episodes."
  ),
});

/**
 * Complete project generation schema — the single-pass AI output
 * Streamed via streamObject for progressive rendering
 */
export const ProjectGenerationSchema = z.object({
  logline: z.string().describe("One compelling sentence that sells the entire story"),
  synopsis: z.string().describe("A rich, detailed synopsis of approximately 1000 characters"),
  characters: z.array(CharacterOutputSchema).describe(
    "4-6 richly detailed characters that bring the narrative to life"
  ),
  episodes: z.array(EpisodeOutputSchema).describe(
    "Episode outlines matching the requested episode count. " +
    "Generate full scriptContent ONLY for Episode 1. All others get null for scriptContent."
  ),
});

/**
 * Per-episode script generation schema — for Episode 2+ on-demand generation
 */
export const EpisodeScriptSchema = z.object({
  scriptContent: z.string().describe(
    "Full screenplay in industry-standard plain text format. " +
    "Use INT./EXT. for scene headings, CHARACTER NAMES IN CAPS before dialog, " +
    "and parentheticals in (brackets). Ensure continuity with previous episodes."
  ),
  updatedSummary: z.string().describe(
    "Updated 300-word rolling summary of this episode's events for long-term memory chaining"
  ),
});

// TypeScript types for consumption
export type CharacterOutput = z.infer<typeof CharacterOutputSchema>;
export type EpisodeOutput = z.infer<typeof EpisodeOutputSchema>;
export type ProjectGeneration = z.infer<typeof ProjectGenerationSchema>;
export type EpisodeScript = z.infer<typeof EpisodeScriptSchema>;

// ============================================
// Directors Arena v3.1 — Production Generation Schemas
// ============================================

export const SimilarContentSchema = z.object({
  title: z.string().describe("Title of a similar existing piece of content"),
  viewer_stats: z.string().describe("E.g., Box office, viewership, or critical reception"),
  similarity_reason: z.string().describe("Why this is a good comp for the current project"),
});

export const ProductionCastingSchema = z.object({
  recommended_actor: z.string().describe("Real-world actor recommendation"),
  reason: z.string().describe("Why this actor is a good fit for the character"),
});

export const ProductionBudgetSchema = z.object({
  estimated_cost: z.number().describe("Estimated total production cost in USD"),
  breakdown_json: z.record(z.string(), z.any()).describe("Detailed JSON breakdown of costs (e.g. Above the line, Cast, VFX, etc.)"),
});

export const ScriptBreakdownSchema = z.object({
  scene_number: z.number().describe("Scene number this breakdown applies to"),
  props: z.array(z.string()).describe("List of individual props"),
  wardrobe: z.array(z.string()).describe("List of wardrobe elements"),
  vfx: z.object({ required: z.boolean(), description: z.string().optional() }).describe("VFX requirements including description if true"),
  extras: z.number().describe("Count of background extras needed"),
});

export const PPLLocationSchema = z.object({
  scene_number: z.number().describe("Scene number for PPL/Location"),
  ppl_category: z.string().describe("Product Placement (PPL) category (e.g., 'Beverage', 'Vehicle')"),
  location_query: z.string().describe("A generic Google Maps search query string for this location (e.g. 'Coffee shop in Seoul')"),
});

export type PPLLocationOutput = z.infer<typeof PPLLocationSchema>;

// ============================================
// Directors Arena v4.2 — Structured Script Drafting
// ============================================

export const SceneElementSchema = z.object({
  type: z.enum(["HEADING", "ACTION", "CHARACTER", "DIALOGUE", "PARENTHETICAL"]),
  content: z.string().describe("The text content of the script element"),
  characterName: z.string().optional().describe("Only for CHARACTER and DIALOGUE types"),
});

export const EpisodeSceneDraftSchema = z.object({
  draftTitle: z.string().describe("Quick title for this scene draft"),
  sceneElements: z.array(SceneElementSchema).describe("Structured elements of the generated scene"),
  updatedSummary: z.string().optional().describe("If this draft significantly changes the episode summary"),
});

export type SceneElement = z.infer<typeof SceneElementSchema>;
export type EpisodeSceneDraft = z.infer<typeof EpisodeSceneDraftSchema>;
