import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ProjectCard } from '@/components/project-list/project-card'; // We might need a simplified version for print, but let's try rendering standard HTML

export default async function PrintDeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: project } = await supabase.from('projects_v2').select('*').eq('id', id).single();
  
  if (!project) return <div>Project not found</div>;

  let parsedSynopsis = project.synopsis;
  if (typeof parsedSynopsis === 'string') {
    try { parsedSynopsis = JSON.parse(parsedSynopsis); } catch {}
  }

  const characters = project.characters || [];
  const similarWorks = project.similar_works || [];

  return (
    <div className="bg-[#050505] text-white min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { background: #050505; color: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          .deck-container { padding: 40px; }
        }
      `}} />

      <div className="no-print fixed top-4 right-4 z-50 flex gap-4">
        <button onClick={() => { if (typeof window !== 'undefined') window.print(); }} className="px-6 py-2 bg-brand-gold text-black font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:scale-105 transition-transform">
          Save as PDF
        </button>
        <Link href={`/project-contents/${id}`} className="px-6 py-2 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors">
          Back
        </Link>
      </div>

      <div className="deck-container max-w-5xl mx-auto py-20 px-10">
        
        {/* Cover Page */}
        <div className="min-h-[800px] flex flex-col justify-center items-center text-center border-b border-white/10 pb-20 mb-20">
          <h4 className="text-brand-gold font-black tracking-[0.5em] mb-6 uppercase text-sm">Pitch Deck</h4>
          <h1 className="text-7xl font-black tracking-tighter mb-8">{project.title}</h1>
          <div className="flex gap-4 text-sm font-bold text-neutral-500 uppercase tracking-widest mb-16">
            <span>{project.genre}</span>
            <span>•</span>
            <span>{project.platform}</span>
          </div>
          <div className="max-w-2xl">
            <h3 className="text-xs font-black text-brand-gold uppercase tracking-[0.3em] mb-6">Logline</h3>
            <p className="text-2xl leading-relaxed font-light text-neutral-200">"{project.logline}"</p>
          </div>
        </div>

        {/* Synopsis Page */}
        <div className="page-break mb-20">
          <h2 className="text-3xl font-black uppercase tracking-[0.2em] mb-10 border-b border-white/10 pb-4">Epic Narrative</h2>
          <p className="text-lg leading-[2.2] text-neutral-300 whitespace-pre-wrap">
            {parsedSynopsis?.story?.epicNarrative || "No narrative generated."}
          </p>
        </div>

        {/* Characters Page */}
        {characters.length > 0 && (
          <div className="page-break mb-20">
            <h2 className="text-3xl font-black uppercase tracking-[0.2em] mb-10 border-b border-white/10 pb-4">Main Characters</h2>
            <div className="grid grid-cols-2 gap-8">
              {characters.slice(0, 4).map((c: any, i: number) => (
                <div key={i} className="p-8 border border-white/10 rounded-3xl bg-white/[0.02]">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black">{c.name}</h3>
                    <span className="text-xs font-black text-brand-gold uppercase tracking-widest px-3 py-1 bg-brand-gold/10 rounded-full">{c.role}</span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-2 uppercase tracking-widest font-bold">{c.age} • {c.job}</p>
                  <p className="text-sm leading-relaxed text-neutral-300 mt-4">{c.description || c.desire}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Works (Comps) */}
        {similarWorks.length > 0 && (
          <div className="page-break mb-20">
            <h2 className="text-3xl font-black uppercase tracking-[0.2em] mb-10 border-b border-white/10 pb-4">Cinematic Benchmarks</h2>
            <div className="grid grid-cols-2 gap-8">
              {similarWorks.slice(0, 4).map((comp: any, i: number) => {
                let extras: any = {};
                if (typeof comp.viewer_stats === 'string') {
                  try { extras = JSON.parse(comp.viewer_stats); } catch {}
                } else if (comp.viewer_stats) {
                  extras = comp.viewer_stats;
                }
                const genres = extras.genres || comp.genres || [];
                return (
                  <div key={i} className="flex gap-6 p-6 border border-white/10 rounded-3xl bg-white/[0.02]">
                    <div className="w-24 h-36 bg-neutral-900 rounded-xl overflow-hidden shrink-0 border border-white/10">
                      {(extras.poster_path || comp.poster_path) && (
                        <img src={extras.poster_path || comp.poster_path} alt={comp.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black mb-2">{comp.title}</h3>
                      <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-4">
                        {Array.isArray(genres) ? genres.join(' / ') : genres}
                      </p>
                      <p className="text-xs leading-relaxed text-neutral-400 line-clamp-3">
                        {comp.similarity_reason}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
