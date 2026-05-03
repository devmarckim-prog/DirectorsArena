
import { createClient } from '@supabase/supabase-js';
import { ProjectGeneration } from "@/lib/schemas/generation";

/**
 * Directors Arena v5.5 — Edge Repository
 * Pure DB persistence logic for Vercel Edge Runtime
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a dedicated edge-compatible admin client
const supabase = createClient(supabaseUrl, supabaseServiceRole);

export async function persistProjectGeneration(
  projectId: string,
  generation: ProjectGeneration
) {
  console.log(`[Repository] Persisting generation for project: ${projectId}`);

  // 1. Update project core data
  const { error: projErr } = await supabase
    .from('projects_v2')
    .update({
      subtitle: generation.englishTitle,
      logline: generation.logline,
      synopsis: generation.synopsis,
      status: 'READY',
      progress: 100,
    })
    .eq('id', projectId);

  if (projErr) throw projErr;

  // 2. Insert characters
  if (generation.characters && generation.characters.length > 0) {
    const charactersToInsert = generation.characters.map(char => ({
      project_id: projectId,
      name: char.name,
      gender: char.gender,
      age: char.age || 0,
      job: char.job || char.role,
      look: char.description,
      relationship_type: char.relationshipToProtagonist,
      age_group: char.ageGroup,
      desire: char.desire,
      relations: char.relations,
      traits: char.traits,
      groups: char.groups
    }));
    await supabase.from('characters_v2').insert(charactersToInsert);
  }

  // 3. Insert episodes + beats (with correct episode_id linkage)
  if (generation.episodes && generation.episodes.length > 0) {
    for (const ep of generation.episodes) {
      const { data: savedEp, error: epErr } = await supabase
        .from('episodes_v2')
        .insert({
          project_id: projectId,
          episode_number: ep.episodeNumber,
          title: ep.title,
          summary: ep.summary,
          script_content: ep.scriptContent,
        })
        .select('id')
        .single();

      if (epErr) {
        console.error(`[Repository] Episode ${ep.episodeNumber} insert failed:`, epErr);
        continue;
      }

      console.log(`[Repository] Episode ${ep.episodeNumber} saved. ID: ${savedEp.id}`);
    }
  }

  // 4. Insert story beats (linked to project for 3-act structure beats)
  if (generation.structure && generation.structure.length > 0) {
    // First, get the episode 1 id for scene-level beats
    const { data: ep1 } = await supabase
      .from('episodes_v2')
      .select('id')
      .eq('project_id', projectId)
      .eq('episode_number', 1)
      .single();

    const beatsToInsert = generation.structure.map((beat, idx) => ({
      project_id: projectId,
      act_number: beat.act_number,
      beat_type: beat.beat_type,
      title: beat.title,
      description: beat.description,
      timestamp_label: beat.timestamp_label,
      order_index: idx,
    }));

    const { error: beatErr } = await supabase
      .from('story_beats_v2')
      .insert(beatsToInsert);

    if (beatErr) {
      console.error(`[Repository] story_beats_v2 insert failed:`, beatErr);
    } else {
      console.log(`[Repository] ${beatsToInsert.length} beats saved with episode_id: ${ep1?.id}`);
    }
  }

  return { success: true };
}
