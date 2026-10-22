import { authGuard } from "@/lib/auth/guard";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, CreditCard, ShieldCheck, LogOut, Activity, ArrowLeft } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await authGuard();
  
  // Safe role check (supporting both app_metadata and role property from POC)
  const role = user?.app_metadata?.role || (user as any)?.role;
  const isMasterAdmin = role === 'admin';

  if (!user || !isMasterAdmin) {
    redirect("/login");
  }

  const menuItems = [
    { name: "대시보드 (Dashboard)", href: "/admin", icon: LayoutDashboard },
    { name: "디렉터 회원 (Users)", href: "/admin/users", icon: Users },
    { name: "크레딧 관리 (Credits)", href: "/admin/credits", icon: CreditCard },
    { name: "시스템 설정 (Settings)", href: "/admin/settings", icon: ShieldCheck },
    { name: "보안 로그 (Logs)", href: "/admin/logs", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#0c0b09] flex text-white font-sans selection:bg-brand-gold/30">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#080705] flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)] group-hover:scale-105 transition-transform">
              <ShieldCheck className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-[0.2em] leading-none">Nexus Admin</h1>
              <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mt-1">Command Center</p>
            </div>
          </Link>
        </div>

        {/* Back to Service Link */}
        <div className="px-6 pb-4">
          <Link
            href="/project-list"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-[11px] font-black text-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/20 transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>메인 서비스로 이동</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3.5 px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-neutral-400 hover:text-brand-gold hover:bg-brand-gold/5 transition-all group"
            >
              <item.icon size={18} className="group-hover:scale-110 transition-transform text-neutral-500 group-hover:text-brand-gold" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-white/[0.02] mb-3">
            <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-black text-[10px]">
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black text-white truncate">{user.email}</p>
              <p className="text-[8px] font-bold text-brand-gold uppercase tracking-widest">Master Admin</p>
            </div>
          </div>
          <Link href="/project-list" className="flex items-center space-x-3 px-4 py-2 text-[10px] font-black text-neutral-500 hover:text-white transition-colors uppercase tracking-widest">
            <LogOut size={14} />
            <span>Exit Console</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
