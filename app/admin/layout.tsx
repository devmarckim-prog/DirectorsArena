import { authGuard } from "@/lib/auth/guard";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, CreditCard, ShieldCheck, LogOut, Activity } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await authGuard();
  
  if (!user) redirect("/login");

  // v10.0: Use app_metadata for secure role checking
  const role = user.app_metadata?.role;
  const isMasterAdmin = role === 'admin';

  if (!isMasterAdmin) {
    redirect("/"); // Not an admin
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "System Settings", href: "/admin/settings", icon: ShieldCheck },
    { name: "Security Logs", href: "/admin/logs", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#0c0b09] flex text-white font-sans selection:bg-brand-gold/30">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#080705] flex flex-col fixed inset-y-0 z-50">
        <div className="p-10">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)] group-hover:scale-105 transition-transform">
              <ShieldCheck className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-[0.2em] leading-none">Nexus</h1>
              <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mt-1">Command Center</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-brand-gold hover:bg-brand-gold/5 transition-all group"
            >
              <item.icon size={18} className="group-hover:scale-110 transition-transform" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="flex items-center space-x-4 px-4 py-4 rounded-2xl bg-white/[0.02] mb-6">
            <div className="w-8 h-8 rounded-full bg-neutral-800" />
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black text-white truncate">{user.email}</p>
              <p className="text-[8px] font-bold text-brand-gold uppercase tracking-widest">Master Admin</p>
            </div>
          </div>
          <Link href="/" className="flex items-center space-x-4 px-6 py-3 text-[10px] font-black text-neutral-600 hover:text-white transition-colors uppercase tracking-widest">
            <LogOut size={14} />
            <span>Exit Console</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12">
        {children}
      </main>
    </div>
  );
}
