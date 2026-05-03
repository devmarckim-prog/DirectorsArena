import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default async function PrintScriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: project } = await supabase.from('projects_v2').select('*, episodes(*)').eq('id', id).single();
  
  if (!project) return <div>Project not found</div>;

  // Render a specific episode if needed, but for now we'll render all available scripts or just EP 1
  const episodes = project.episodes || [];
  const validEpisodes = episodes.filter((ep: any) => ep.script_content?.trim());

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Print Specific CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 1in; }
          body { background: white; -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        .script-font { font-family: "Courier New", Courier, monospace; font-size: 12pt; line-height: 1.2; }
        .script-scene { font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; text-transform: uppercase; }
        .script-action { margin-bottom: 1rem; }
        .script-character { text-align: center; font-weight: bold; margin-top: 1.5rem; text-transform: uppercase; width: 50%; margin-left: 25%; }
        .script-dialogue { text-align: left; width: 50%; margin-left: 25%; margin-bottom: 1rem; }
        .script-parenthetical { text-align: center; width: 50%; margin-left: 25%; font-style: italic; }
      `}} />

      <div className="no-print fixed top-4 right-4 z-50 flex gap-4">
        <button onClick={() => { if (typeof window !== 'undefined') window.print(); }} className="px-6 py-2 bg-black text-white font-bold rounded-full shadow-lg">
          Save as PDF / Print
        </button>
        <Link href={`/project-contents/${id}`} className="px-6 py-2 bg-gray-200 text-black font-bold rounded-full shadow-lg">
          Back
        </Link>
      </div>

      {validEpisodes.length === 0 ? (
        <div className="p-20 text-center font-bold">No scripts generated yet.</div>
      ) : (
        validEpisodes.map((ep: any) => (
          <div key={ep.id} className="max-w-3xl mx-auto py-10 px-4 script-font page-break-after">
            <h1 className="text-3xl font-bold text-center mb-24 mt-20">{project.title.toUpperCase()}</h1>
            <h2 className="text-xl text-center mb-40">EPISODE {ep.episode_number}</h2>
            
            <div className="whitespace-pre-wrap">
              {ep.script_content.split('\n').map((line: string, i: number) => {
                const text = line.trim();
                if (!text) return <div key={i} className="h-4" />;
                
                // Heuristics for formatting
                if (text.startsWith('INT.') || text.startsWith('EXT.') || text.match(/^S#\s*\d+/)) {
                  return <div key={i} className="script-scene">{text}</div>;
                } else if (text.startsWith('(') && text.endsWith(')')) {
                  return <div key={i} className="script-parenthetical">{text}</div>;
                } else if (text === text.toUpperCase() && text.length < 40 && !text.match(/^[0-9]/)) {
                  return <div key={i} className="script-character">{text}</div>;
                } else if (i > 0 && linesToHTML(ep.script_content, i-1) === 'CHARACTER') {
                   // This is very rudimentary. Real parsing is complex.
                  return <div key={i} className="script-dialogue">{text}</div>;
                } else {
                  return <div key={i} className="script-action">{text}</div>;
                }
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function linesToHTML(script: string, index: number) {
  const lines = script.split('\n');
  const text = lines[index]?.trim() || '';
  if (text === text.toUpperCase() && text.length < 40 && !text.match(/^[0-9]/) && text.length > 0) return 'CHARACTER';
  return 'ACTION';
}
