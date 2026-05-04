import { fetchAdminDashboardStats } from "@/lib/actions/admin";
import { Users, CreditCard, Sparkles, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";

export default async function AdminDashboardPage() {
  const stats = await fetchAdminDashboardStats();

  const statCards = [
    { name: "Total Directors", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
    { name: "New Recruits (Today)", value: stats.todayJoiners, icon: Sparkles, color: "text-brand-gold" },
    { name: "Paid Elite", value: stats.paidSubscribers, icon: TrendingUp, color: "text-green-400" },
    { name: "Today's Consumption", value: `${stats.todayCreditUsage}C`, icon: CreditCard, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Nexus Overview</h2>
        <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.4em]">Strategic System Intelligence</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.05] transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.name}</p>
            <p className="text-3xl font-black">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <section className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Clock className="text-brand-gold" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest">Recent Enrollments</h3>
          </div>
          <button className="text-[10px] font-black text-neutral-500 hover:text-white uppercase tracking-widest transition-colors">View All Users</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-neutral-600">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Identity</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Plan</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Balance</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Enrolled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-6">
                    <p className="text-xs font-black text-white">{user.full_name || 'Anonymous Director'}</p>
                    <p className="text-[10px] font-bold text-neutral-500">{user.email}</p>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.plan !== 'free' ? 'bg-brand-gold/20 text-brand-gold' : 'bg-white/5 text-neutral-500'}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-xs font-bold text-neutral-400">{user.credits.toLocaleString()} C</td>
                  <td className="px-10 py-6 text-right text-[10px] font-bold text-neutral-600">
                    {format(new Date(user.created_at), "yyyy.MM.dd HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
