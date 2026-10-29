const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Users', 'happy', 'OneDrive', '문서', '99. App_Dev', 'Directors_Areana', 'app', 'page.tsx');
let s = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');

const oldNotice = `        {/* POC Notice Pill */}
        <div className="mt-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-neutral-400 text-xs font-mono">
          <ShieldCheck size={14} className="text-brand-gold" />
          <span>POC 접속 시 로그인 없이 어드민 권한으로 즉시 입장하며, AI 생성 시 더미 데이터가 로드됩니다.</span>
        </div>`;

const newNotice = `        {/* POC Notice Pill & Admin Direct Link */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-neutral-400 text-xs font-mono">
            <ShieldCheck size={14} className="text-brand-gold" />
            <span>POC 접속 시 로그인 없이 어드민 권한으로 즉시 입장하며 더미 데이터가 로드됩니다.</span>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-gold/20 hover:bg-brand-gold/30 border border-brand-gold/50 text-brand-gold text-xs font-black shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all hover:scale-105"
          >
            <ShieldCheck size={14} />
            <span>🛡️ 어드민 콘솔 바로가기</span>
          </Link>
        </div>`;

s = s.replace(oldNotice, newNotice);
s = s.replace('Protocol v10.2.0 (POC Ready)', 'Protocol v10.2.2 (POC & Admin Ready)');
fs.writeFileSync(filePath, s, 'utf-8');
console.log('Successfully updated app/page.tsx with direct Admin link');
