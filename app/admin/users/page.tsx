import { fetchUserListAction } from "@/lib/actions/admin";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { UserStatusButton } from "@/components/admin/user-status-button";
import { CreditGrantButton } from "@/components/admin/credit-grant-button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const { users, totalCount } = await fetchUserListAction(currentPage, q);

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Director Registry</h2>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.4em]">Managing {totalCount} Elite Members</p>
        </div>
        
        {/* Search Bar */}
        <form className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-brand-gold transition-colors" size={18} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or email..."
            className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-8 text-xs font-bold w-80 outline-none focus:border-brand-gold/50 transition-all placeholder:text-neutral-700"
          />
        </form>
      </header>

      <section className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-neutral-600">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">User Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">Joined Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">Engagement</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">Revenue</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-center">Credits</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Status / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-brand-gold">
                        {user.full_name?.[0] || 'A'}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">{user.full_name || 'Anonymous'}</p>
                        <p className="text-[10px] font-bold text-neutral-500">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-brand-gold">{user.role}</span>
                          <span className="text-neutral-800 text-[8px]">•</span>
                          <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest">{user.plan} plan</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <p className="text-[10px] font-bold text-neutral-400">{format(new Date(user.created_at), "yyyy.MM.dd")}</p>
                    <p className="text-[8px] font-bold text-neutral-700 uppercase mt-1">{format(new Date(user.created_at), "HH:mm")}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-xs font-black text-white">{(user as any).projectCount}</span>
                      <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest mt-1">Projects</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-xs font-black text-emerald-500">₩{((user as any).totalPayments * 10).toLocaleString()}</span>
                      <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest mt-1">Total Paid</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <CreditGrantButton 
                      userEmail={user.email} 
                      currentCredits={user.credits}
                    />
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        (user as any).status === 'disabled' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                      )}>
                        {(user as any).status || 'active'}
                      </span>
                      <UserStatusButton userId={user.id} currentStatus={(user as any).status || 'active'} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Simple Pagination */}
      <div className="flex items-center justify-center space-x-4">
        {currentPage > 1 && (
          <Link href={`/admin/users?page=${currentPage - 1}${q ? `&q=${q}` : ''}`} className="text-[10px] font-black text-neutral-600 hover:text-white uppercase tracking-widest">Prev Page</Link>
        )}
        <span className="text-xs font-bold text-brand-gold">{currentPage}</span>
        {totalCount > currentPage * 20 && (
          <Link href={`/admin/users?page=${currentPage + 1}${q ? `&q=${q}` : ''}`} className="text-[10px] font-black text-neutral-600 hover:text-white uppercase tracking-widest">Next Page</Link>
        )}
      </div>
    </div>
  );
}
