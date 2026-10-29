const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'lib', 'actions', 'project.ts');
let code = fs.readFileSync(targetFile, 'utf-8').replace(/\r\n/g, '\n');

// 1. Add imports
if (!code.includes('loadPocProjects')) {
  code = `import { cookies } from "next/headers";
import { POC_COOKIE_NAME, loadPocProjects, savePocProject, getPocProjectById, getPocDummyGeneration } from "@/lib/poc";
import { ELITE_SAMPLES } from "@/lib/constants";
` + code;
}

// 2. Wrap createProjectAction to support POC mode & offline fallback
const createStart = "export async function createProjectAction(formData: any) {";
const createPocCheck = `export async function createProjectAction(formData: any) {
  try {
    const cookieStore = await cookies();
    const isPoc = cookieStore.get(POC_COOKIE_NAME)?.value === 'true';

    // Auto-generate temp title
    let tempTitle = formData.title;
    if (!tempTitle && formData.logline) {
      const words = formData.logline.match(/[가-힣a-zA-Z0-9]{2,}/g) || [];
      if (words.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(words.length, 5));
        tempTitle = \`[가칭] \${words[randomIndex]}\`;
      }
    }
    if (!tempTitle) tempTitle = \`\${formData.genres?.[0] || 'Drama'} Epic\`;

    if (isPoc) {
      const pocId = crypto.randomUUID();
      const pocProject = {
        id: pocId,
        title: tempTitle,
        genre: formData.genres?.[0] || 'Drama',
        platform: formData.platform || 'Movie',
        duration: formData.duration || 120,
        world: formData.world?.setting || 'Contemporary',
        logline: formData.logline || '',
        status: 'BAKING',
        progress: 10,
        is_sample: false,
        created_at: new Date().toISOString(),
        synopsis: JSON.stringify({
          seed: true,
          formData
        })
      };
      savePocProject(pocProject);
      revalidatePath("/project-list");
      return { success: true, projectId: pocId };
    }
  } catch (e) {}
`;

if (!code.includes('const isPoc = cookieStore.get(POC_COOKIE_NAME)')) {
  code = code.replace(createStart, createPocCheck);
}

// 3. Update catch block of createProjectAction
const oldCatch = `  } catch (err: any) {
    console.error("Supabase Insert Error (Catch Block):", err);
    return { success: false, error: err.message || "Failed to create project." };
  }`;

const newCatch = `  } catch (err: any) {
    console.error("Supabase Insert Error (Catch Block), falling back to local POC store:", err);
    const pocId = crypto.randomUUID();
    const pocProject = {
      id: pocId,
      title: formData.title || 'New Drama Project',
      genre: formData.genres?.[0] || 'Drama',
      platform: formData.platform || 'Movie',
      duration: formData.duration || 120,
      world: formData.world?.setting || 'Contemporary',
      logline: formData.logline || '',
      status: 'BAKING',
      progress: 10,
      is_sample: false,
      created_at: new Date().toISOString(),
      synopsis: JSON.stringify({ seed: true, formData })
    };
    savePocProject(pocProject);
    revalidatePath("/project-list");
    return { success: true, projectId: pocId };
  }`;

code = code.replace(oldCatch, newCatch);

// 4. Update fetchProjectsAction
const oldFetchProjects = `export async function fetchProjectsAction() {
  const supabase = createAdminClient();

  // Check show_samples setting dynamically
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('show_samples')
    .limit(1)
    .single();

  const showSamples = settings ? settings.show_samples !== false : true;

  let query = supabase.from('projects_v2').select('*');
  
  if (!showSamples) {
    query = query.neq('is_sample', true);
  }

  const { data, error } = await query
    .order('is_sample', { ascending: true })
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}`;

const newFetchProjects = `export async function fetchProjectsAction() {
  const pocProjects = loadPocProjects();
  try {
    const supabase = createAdminClient();
    const { data: settings } = await supabase
      .from('admin_settings')
      .select('show_samples')
      .limit(1)
      .single();

    const showSamples = settings ? settings.show_samples !== false : true;

    let query = supabase.from('projects_v2').select('*');
    if (!showSamples) {
      query = query.neq('is_sample', true);
    }

    const { data, error } = await query
      .order('is_sample', { ascending: true })
      .order('created_at', { ascending: false });
      
    if (!error && data && data.length > 0) {
      const existingIds = new Set(data.map((p: any) => p.id));
      const filteredPoc = pocProjects.filter((p: any) => !existingIds.has(p.id));
      return [...filteredPoc, ...data];
    }
  } catch (err) {
    console.warn('[fetchProjectsAction] Supabase query offline, falling back to local/sample projects');
  }

  const sampleMap = new Set(pocProjects.map((p: any) => p.id));
  const samplesToAdd = ELITE_SAMPLES.filter((s: any) => !sampleMap.has(s.id));
  return [...pocProjects, ...samplesToAdd];
}`;

code = code.replace(oldFetchProjects, newFetchProjects);

// 5. Update fetchProjectDetailsAction
const oldDetailsHeader = "export async function fetchProjectDetailsAction(id: string) {";
const newDetailsHeader = `export async function fetchProjectDetailsAction(id: string) {
  // Check local POC project
  const localPoc = getPocProjectById(id);
  if (localPoc) {
    const dummy = getPocDummyGeneration(localPoc);
    return {
      ...localPoc,
      characters: localPoc.characters || dummy.characters,
      scenes: [],
      episodes: (localPoc.episodes || dummy.episodes).map((ep: any) => ({
        ...ep,
        id: ep.id || \`ep-\${ep.episodeNumber}\`,
        story_beats_v2: dummy.structure.map((b: any, bIdx: number) => ({
          ...b,
          id: \`beat-\${bIdx}\`,
          scene_number: bIdx + 1,
          order_index: bIdx + 1
        }))
      })),
      storyBeats: dummy.structure,
      isPoc: true
    };
  }

  // Check ELITE_SAMPLES
  const sample = ELITE_SAMPLES.find((s: any) => s.id === id);
  if (sample) {
    const dummy = getPocDummyGeneration(sample);
    return {
      ...sample,
      characters: dummy.characters,
      scenes: [],
      episodes: dummy.episodes.map((ep: any) => ({
        ...ep,
        id: \`ep-\${ep.episodeNumber}\`,
        story_beats_v2: dummy.structure.map((b: any, bIdx: number) => ({
          ...b,
          id: \`beat-\${bIdx}\`,
          scene_number: bIdx + 1,
          order_index: bIdx + 1
        }))
      })),
      storyBeats: dummy.structure,
      isPoc: true
    };
  }
`;

if (!code.includes('const localPoc = getPocProjectById(id)')) {
  code = code.replace(oldDetailsHeader, newDetailsHeader);
}

fs.writeFileSync(targetFile, code, 'utf-8');
console.log('Successfully updated lib/actions/project.ts');
