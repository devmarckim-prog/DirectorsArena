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
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Permissions</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Credits</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                    <p className="text-xs font-black text-white">{user.full_name || 'Anonymous'}</p>
                    <p className="text-[10px] font-bold text-neutral-500">{user.email}</p>
                    <p className="text-[8px] font-bold text-neutral-700 mt-1 uppercase tracking-widest">Enrolled: {format(new Date(user.created_at), "yyyy.MM.dd")}</p>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col space-y-1">
                       <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold">{user.role}</span>
                       <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest">{user.plan} plan</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xs font-bold text-neutral-400">{user.credits.toLocaleString()} C</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      user.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    )}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <CreditGrantButton userEmail={user.email} />
                      <UserStatusButton userId={user.id} currentStatus={user.status || 'active'} />
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
