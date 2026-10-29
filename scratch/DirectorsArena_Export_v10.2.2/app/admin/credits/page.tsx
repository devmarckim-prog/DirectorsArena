import { CreditCard, Send, History } from "lucide-react";
import { CreditGrantForm } from "@/components/admin/credit-grant-form";
import { createAdminClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { POC_COOKIE_NAME } from "@/lib/poc";

export default async function AdminCreditsPage() {
  let isPoc = false;
  try {
    const cookieStore = await cookies();
    isPoc = cookieStore.get(POC_COOKIE_NAME)?.value === 'true';
  } catch {}

  let recentGrants: any[] = [];
  if (!isPoc) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from('credit_transactions')
        .select('id, user_id, amount, reason, created_at, users(email, full_name)')
        .eq('reason', 'manual_grant')
        .order('created_at', { ascending: false })
        .limit(10);
      recentGrants = data || [];
    } catch (err) {
      recentGrants = [];
    }
  }

  if (!recentGrants || recentGrants.length === 0) {
    recentGrants = [
      {
        id: 'grant-poc-1',
        user_id: 'poc-admin',
        amount: 99999,
        reason: 'manual_grant',
        created_at: new Date().toISOString(),
        users: { email: 'test-admin@directorsarena.internal', full_name: '테스트 어드민 (POC)' }
      },
      {
        id: 'grant-poc-2',
        user_id: 'usr-1',
        amount: 500,
        reason: 'manual_grant',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        users: { email: 'kim.director@studio.kr', full_name: '김도훈 감독' }
      }
    ];
  }

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Credit Logistics</h2>
        <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.4em]">Resource Provisioning & Auditing</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Grant Form Section */}
        <section className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10">
          <div className="flex items-center space-x-4 mb-10">
            <div className="p-3 rounded-2xl bg-brand-gold/10 text-brand-gold">
              <Send size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Manual Grant Protocol</h3>
          </div>
          
          <CreditGrantForm />
        </section>

        {/* Recent History Section */}
        <section className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
          <div className="px-10 py-8 border-b border-white/5 flex items-center space-x-4">
            <History className="text-neutral-500" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Recent Provisions</h3>
          </div>
          
          <div className="divide-y divide-white/5">
            {recentGrants?.map((grant: any) => (
              <div key={grant.id} className="px-10 py-6 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">+{grant.amount} Credits</p>
                  <p className="text-[9px] font-bold text-neutral-600">{format(new Date(grant.created_at), "MM.dd HH:mm")}</p>
                </div>
                <p className="text-xs font-bold text-white mb-1">{(grant.users as any)?.full_name || 'Anonymous'}</p>
                <p className="text-[10px] font-medium text-neutral-500">{(grant.users as any)?.email}</p>
              </div>
            ))}
            {(!recentGrants || recentGrants.length === 0) && (
              <div className="px-10 py-12 text-center text-neutral-700 italic text-xs">
                No recent manual grants found.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
