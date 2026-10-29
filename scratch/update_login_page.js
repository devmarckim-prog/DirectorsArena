const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Users', 'happy', 'OneDrive', '문서', '99. App_Dev', 'Directors_Areana', 'app', 'login', 'page.tsx');
let s = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');

const pocButton = `          {/* POC Test Admin Instant Access */}
          <button
            onClick={async () => {
              if (loading) return;
              setLoading(true);
              document.cookie = "da_poc_admin=true; path=/; max-age=604800";
              const { pocLoginAction } = await import("@/lib/actions/auth");
              await pocLoginAction();
            }}
            disabled={loading}
            className="mt-4 w-full h-[52px] bg-gradient-to-r from-brand-gold/30 via-brand-gold to-brand-gold/30 hover:brightness-110 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(197,160,89,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} />
            <span>POC 테스트 어드민 즉시 접속</span>
          </button>
`;

if (!s.includes('POC 테스트 어드민 즉시 접속')) {
  s = s.replace('{/* Dev Only: Admin Bypass Button */}', pocButton + '\n          {/* Dev Only: Admin Bypass Button */}');
  fs.writeFileSync(filePath, s, 'utf-8');
  console.log('Successfully added POC button to login page');
}
