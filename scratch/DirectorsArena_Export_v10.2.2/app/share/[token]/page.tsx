import { createClient } from '@supabase/supabase-js';
import { ProjectCard } from '@/components/project-list/project-card';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Disable cache for sharing

export default async function SharedProjectPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Search for the project using JSONB contains operator
  const { data: projects, error } = await supabase
    .from('projects_v2')
    .select('*')
    .contains('generated_content', { shareConfig: { token: token, enabled: true } })
    .limit(1);

  if (error || !projects || projects.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Lock className="w-16 h-16 text-neutral-800 mb-6" />
        <h1 className="text-2xl font-black uppercase tracking-widest text-neutral-500">Access Denied</h1>
        <p className="text-neutral-600 mt-2 text-sm">The share link is invalid or has expired.</p>
        <Link href="/" className="mt-8 px-6 py-3 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const project = projects[0];
  let parsedSynopsis = project.synopsis;
  if (typeof parsedSynopsis === 'string') {
    try { parsedSynopsis = JSON.parse(parsedSynopsis); } catch {}
  }

  // Very simplified read-only view
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-gold/30 pb-40">
      <header className="fixed top-0 left-0 w-full h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl z-50 flex items-center px-8 justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-6 h-6 rounded-sm bg-brand-gold" />
          <span className="font-black tracking-[0.3em] uppercase text-xs">Directors Arena</span>
          <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-widest bg-white/10 text-white/50 ml-2">Read-Only</span>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto pt-32 px-6">
        <div className="mb-16">
          <h1 className="text-5xl font-black tracking-tighter mb-4">{project.title}</h1>
          <div className="flex gap-4 text-xs font-bold text-neutral-500 uppercase tracking-widest mb-8">
            <span>{project.genre}</span>
            <span>•</span>
            <span>{project.platform}</span>
          </div>
          
          <div className="p-8 border border-white/10 rounded-3xl bg-white/[0.02] mb-12">
            <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] mb-4">Logline</h3>
            <p className="text-lg leading-relaxed text-neutral-300">"{project.logline}"</p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] border-b border-white/10 pb-4">Epic Narrative</h3>
            <p className="text-sm leading-[2] text-neutral-400 whitespace-pre-wrap">
              {parsedSynopsis?.story?.epicNarrative || "No narrative generated yet."}
            </p>
          </div>
        </div>

        {parsedSynopsis?.episodes && parsedSynopsis.episodes.length > 0 && (
          <div className="mt-20">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] border-b border-white/10 pb-4 mb-8">Episodes</h3>
            <div className="space-y-4">
              {parsedSynopsis.episodes.map((ep: any, idx: number) => (
                <div key={idx} className="p-6 border border-white/10 rounded-2xl bg-white/[0.01]">
                  <h4 className="font-bold text-brand-gold mb-2">EPISODE {ep.episodeNumber || idx + 1}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{ep.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
