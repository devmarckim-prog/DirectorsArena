import { z } from 'zod';

// 1. Block Instance Schema (individual line/beat in a script)
export const BlockSchema = z.object({
  id: z.string().uuid().optional(),
  scene_id: z.string().uuid(),
  type: z.enum(['action', 'dialogue', 'parenthetical', 'transition']),
  character_name: z.string().optional(),
  content: z.string(),
  order_index: z.number(),
  metadata: z.record(z.any()).optional(),
});

// 2. Scene Instance Schema
export const SceneSchema = z.object({
  id: z.string().uuid().optional(),
  project_id: z.string().uuid(),
  scene_number: z.number(),
  location: z.string(),
  time_of_day: z.string(),
  summary: z.string().optional(),
  status: z.enum(['pending', 'draft', 'qc_passed', 'qc_failed', 'final']).default('pending'),
  qc_report: z.record(z.any()).optional(),
  blocks: z.array(BlockSchema).optional(),
});

// 3. Project Instance Schema
export const ProjectSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  genre: z.string().optional(),
  logline: z.string().optional(),
  synopsis: z.string().optional(),
  status: z.enum(['draft', 'writing', 'qc', 'done', 'error']).default('draft'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Types for TypeScript usage
export type Block = z.infer<typeof BlockSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Project = z.infer<typeof ProjectSchema>;
