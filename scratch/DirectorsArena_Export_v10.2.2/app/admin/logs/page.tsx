import { fetchLoginLogsAction } from "@/lib/actions/admin";
import { ShieldAlert, Globe, Monitor, Clock } from "lucide-react";
import { format } from "date-fns";

export default async function AdminLogsPage() {
  const logs = await fetchLoginLogsAction();

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Security Archives</h2>
        <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.4em]">Monitoring Global Access Protocols</p>
      </header>

      <section className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-neutral-600">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">User / Identity</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Access Point (IP)</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Device Metadata</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                    <p className="text-xs font-black text-white">{log.email}</p>
                    <p className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest">ID: {log.user_id.slice(0,8)}...</p>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-3">
                       <Globe size={14} className="text-blue-500/50" />
                       <span className="text-xs font-mono text-neutral-400">{log.ip_address}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-3">
                       <Monitor size={14} className="text-neutral-600" />
                       <span className="text-[10px] font-medium text-neutral-500 truncate max-w-xs">{log.user_agent}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <Clock size={12} className="text-neutral-700" />
                       <span className="text-[10px] font-bold text-neutral-400">
                         {format(new Date(log.created_at), "yyyy.MM.dd HH:mm:ss")}
                       </span>
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center text-neutral-700 italic text-xs uppercase tracking-widest">
                    No security archives detected in current pulse.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Security Alert Legend */}
      <div className="flex items-center justify-center p-8 bg-brand-gold/5 border border-brand-gold/10 rounded-3xl">
         <ShieldAlert size={18} className="text-brand-gold mr-4" />
         <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
           All access is monitored via encrypted protocols. Any unauthorized entry attempts will be automatically flagged for Nexus review.
         </p>
      </div>
    </div>
  );
}
