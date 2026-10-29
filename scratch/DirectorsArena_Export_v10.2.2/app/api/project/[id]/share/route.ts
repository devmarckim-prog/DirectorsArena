import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const { enable } = body; // boolean

    // Fetch current project to get generated_content JSONB
    const { data: project, error: fetchErr } = await supabase
      .from('projects_v2')
      .select('generated_content')
      .eq('id', projectId)
      .single();

    if (fetchErr || !project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const currentContent = typeof project.generated_content === 'string' 
      ? JSON.parse(project.generated_content) 
      : (project.generated_content || {});

    // Initialize or update shareConfig
    let shareConfig = currentContent.shareConfig || {};
    
    if (enable) {
      if (!shareConfig.token) {
        shareConfig.token = crypto.randomUUID();
      }
      shareConfig.enabled = true;
    } else {
      shareConfig.enabled = false;
    }

    const updatedContent = {
      ...currentContent,
      shareConfig
    };

    const { error: updateErr } = await supabase
      .from('projects_v2')
      .update({ generated_content: updatedContent })
      .eq('id', projectId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, shareConfig });
  } catch (error: any) {
    console.error("[ShareAPI] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
