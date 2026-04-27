"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Phase 1: Instant DB insert → returns projectId for immediate redirect.
 * AI generation happens later via the streaming API route.
 */
export async function createProjectAction(formData: any) {
  try {
    const supabase = createAdminClient();

    const episodeCount = formData.episodes || 1;

    // v6.5: Extract temporary title from logline (Auto-Naming)
    let tempTitle = formData.title;
    if (!tempTitle && formData.logline) {
      const words = formData.logline.match(/[가-힣a-zA-Z0-9]{2,}/g) || [];
      if (words.length > 0) {
        // Pick an interesting word (not just the first one, maybe one from the middle)
        const randomIndex = Math.floor(Math.random() * Math.min(words.length, 5));
        tempTitle = `[가칭] ${words[randomIndex]}`;
      }
    }
    if (!tempTitle) tempTitle = `${formData.genres?.[0] || 'Drama'} Epic`;

    const { data: project, error: insertError } = await supabase
      .from('projects_v2')
      .insert({
        title: tempTitle,
        genre: formData.genres?.[0] || 'Drama',
        platform: formData.platform || 'Movie',
        duration: formData.duration || 120,
        world: formData.world?.setting || 'Contemporary',
        logline: formData.logline || '',
        status: 'BAKING',
        progress: 10, // Start with 10% ignition state
        // Store technical blob for fallback, but main data is now in columns (v4.3)
        synopsis: JSON.stringify({
          seed: true,
          formData: {
            platform: formData.platform,
            genres: formData.genres,
            episodes: episodeCount,
            duration: formData.duration,
            logline: formData.logline,
            world: formData.world,
          }
        })
      })
      .select('*')
      .single();

    if (insertError || !project) {
      console.error("Supabase Insert Error: projects_v2 ->", insertError);
      throw new Error(`Failed to create project: ${insertError?.message}`);
    }

    // Phase 2: Persist Character Roster (v4.3 Architecture)
    // We save characters into dedicated characters_v2 table immediately
    if (formData.characters && formData.characters.length > 0) {
      const charactersToInsert = formData.characters.map((char: any) => ({
        project_id: project.id,
        name: char.name,
        role: char.role,
        description: char.description,
        gender: char.gender || 'OTHER',
        age_group: char.ageGroup || '30S',
        relationship_to_protagonist: char.relationshipToProtagonist || '',
        groups: char.groups || []
      }));

      const { error: charError } = await supabase
        .from('characters_v2')
        .insert(charactersToInsert);

      if (charError) {
        console.warn("Supabase Warning: characters_v2 insert failed but project created ->", charError);
      }
    }

    revalidatePath("/project-list");
    return { success: true, projectId: project.id };
  } catch (err: any) {
    console.error("Supabase Insert Error (Catch Block):", err);
    return { success: false, error: err.message || "Failed to create project." };
  }
}

export async function fetchProjectsAction() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('projects_v2')
    .select('*')
    .order('is_sample', { ascending: true })
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function fetchProjectDetailsAction(id: string) {
  const supabase = createAdminClient();
  const { data: project } = await supabase.from('projects_v2').select('*').eq('id', id).single();
  if (!project) return null;

  const { data: characters } = await supabase.from('characters_v2').select('*').eq('project_id', id);
  const { data: scenes } = await supabase.from('scenes_v2').select('*').eq('project_id', id).order('scene_number', { ascending: true });
  const { data: episodes } = await supabase.from('episodes_v2').select('*').eq('project_id', id).order('episode_number', { ascending: true });
  const { data: storyBeats } = await supabase.from('story_beats_v2').select('*').eq('project_id', id).order('order_index', { ascending: true });

  // v9.8: Decouple title and subtitle
  let synopsis = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
  const subtitle = synopsis?.title_en || project.title?.split(/[()]/)[1]?.trim();
  const mainTitle = project.title?.split(/[()]/)[0]?.trim();

  // Dynamically fetch similar works if available
  const { data: similarWorks } = await supabase
    .from('similar_contents')
    .select('*')
    .eq('project_id', id);

  return { 
    ...project, 
    title: mainTitle,
    subtitle: subtitle,
    characters: characters || [], 
    scenes: scenes || [], 
    episodes: episodes || [], 
    story_beats: storyBeats || [], 
    similar_works: similarWorks || [] 
  };
}

export async function updateProjectAction(id: string, updates: { title?: string, subtitle?: string, genre?: string, logline?: string, synopsis?: string }) {
  try {
    const supabase = createAdminClient();
    
    // v9.8: Handle subtitle separation
    if (updates.subtitle !== undefined || updates.title !== undefined) {
      const { data: project } = await supabase.from('projects_v2').select('title, synopsis').eq('id', id).single();
      if (project) {
        let synopsis = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
        
        if (updates.subtitle !== undefined) {
          synopsis.title_en = updates.subtitle;
        }
        
        const finalTitle = updates.title || project.title?.split(/[()]/)[0]?.trim();
        
        const { error } = await supabase
          .from('projects_v2')
          .update({ 
            title: finalTitle,
            synopsis: JSON.stringify(synopsis),
            genre: updates.genre,
            logline: updates.logline
          })
          .eq('id', id);
          
        if (error) throw error;
      }
    } else {
      const { error } = await supabase
        .from('projects_v2')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    }

    revalidatePath("/admin");
    revalidatePath("/project-list");
    revalidatePath(`/project-contents/${id}`);
    
    return { success: true };
  } catch (err: any) {
    console.error("Catch Block Update Failure:", err);
    return { success: false, error: err.message || "Failed to persist changes." };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const supabase = createAdminClient();

    // Cascade Delete
    await Promise.all([
      supabase.from('characters_v2').delete().eq('project_id', id),
      supabase.from('episodes_v2').delete().eq('project_id', id),
      supabase.from('scenes_v2').delete().eq('project_id', id),
      supabase.from('story_beats_v2').delete().eq('project_id', id),
      supabase.from('similar_contents').delete().eq('project_id', id)
    ]);

    const { error } = await supabase.from('projects_v2').delete().eq('id', id);
    
    if (error) {
      console.error("Supabase Deletion Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/project-list");
    
    return { success: true };
  } catch (err: any) {
    console.error("Deletion Failure:", err);
    return { success: false, error: err.message || "Failed to excise project." };
  }
}

export async function purgeAllProjectsAction() {
  const supabase = createAdminClient();
  const { error } = await supabase.from('projects_v2').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/project-list");
  return { success: true };
}

export async function fetchSimilarWorksAction(projectId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('similar_contents')
    .select('*')
    .eq('project_id', projectId);
    
  if (error) return [];
  return data || [];
}

export async function updateCharacterAction(id: string, updates: any, projectId?: string) {
  try {
    const supabase = createAdminClient();
    
    // 1. Try updating normalized table first
    const { data: normalizedChar, error: nError } = await supabase
      .from('characters_v2')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!nError && normalizedChar) {
      revalidatePath(`/project-contents/${normalizedChar.project_id}`);
      return { success: true };
    }

    // 2. Fallback: Update within projects_v2.synopsis (and track history)
    if (!projectId) {
      // If no projectId, try to find the project by char name/id (less efficient but necessary fallback)
      const { data: allProjects } = await supabase.from('projects_v2').select('id, synopsis');
      for (const p of (allProjects || [])) {
        const syn = typeof p.synopsis === 'string' ? JSON.parse(p.synopsis) : p.synopsis;
        if (syn?.characters?.some((c: any) => c.id === id || c.name === id)) {
          projectId = p.id;
          break;
        }
      }
    }

    if (projectId) {
      const { data: project } = await supabase.from('projects_v2').select('synopsis').eq('id', projectId).single();
      if (project) {
        let synopsis = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
        if (synopsis.characters) {
          const charIdx = synopsis.characters.findIndex((c: any) => c.id === id || c.name === id);
          if (charIdx > -1) {
            const oldChar = { ...synopsis.characters[charIdx] };
            const newChar = { ...oldChar, ...updates };
            
            // Apply Update
            synopsis.characters[charIdx] = newChar;

            // Track History (v9.5)
            if (!synopsis.edit_history) synopsis.edit_history = [];
            synopsis.edit_history.push({
              timestamp: new Date().toISOString(),
              type: 'CHARACTER_UPDATE',
              targetId: id,
              before: oldChar,
              after: newChar
            });

            const { error: sError } = await supabase
              .from('projects_v2')
              .update({ synopsis: JSON.stringify(synopsis) })
              .eq('id', projectId);

            if (sError) throw sError;
            revalidatePath(`/project-contents/${projectId}`);
            return { success: true };
          }
        }
      }
    }

    return { success: false, error: "Character not found in database or synopsis." };
  } catch (err: any) {
    console.error("Advanced Character Update Failure:", err);
    return { success: false, error: err.message };
  }
}
