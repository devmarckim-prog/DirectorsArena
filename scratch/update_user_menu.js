const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Users', 'happy', 'OneDrive', '문서', '99. App_Dev', 'Directors_Areana', 'components', 'auth', 'user-menu.tsx');
let s = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');

// 1. Update onAuthStateChange
const oldAuth = `      if (session?.user) {
        const googleAvatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
        await fetchProfile(session.user.id, session.user.email!, googleAvatar);
      } else {
        setUser(null);
      }`;

const newAuth = `      if (session?.user) {
        const googleAvatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
        await fetchProfile(session.user.id, session.user.email!, googleAvatar);
      } else {
        const profile = await getCurrentUserAction();
        if (profile) {
          setUser(profile as UserProfile);
        } else {
          setUser(null);
        }
      }`;

if (s.includes(oldAuth)) {
  s = s.replace(oldAuth, newAuth);
}

// 2. Update Admin button in menu
const oldAdminBtn = `{user.role === 'admin' && (
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/admin');
                  }}
                  className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-white/5 transition-all group text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-brand-gold/20 transition-colors">
                    <Shield size={14} className="text-neutral-500 group-hover:text-brand-gold transition-colors" />
                  </div>
                  <span className="text-[11px] font-black text-neutral-400 group-hover:text-white uppercase tracking-widest transition-colors">Nexus Console</span>
                </button>
              )}`;

const newAdminBtn = `{(user.role === 'admin' || user.id === 'poc-test-admin-id') && (
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/admin');
                  }}
                  className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-brand-gold/10 hover:bg-brand-gold/20 transition-all group text-left border border-brand-gold/20"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/30 group-hover:bg-brand-gold/30 transition-colors">
                    <Shield size={14} className="text-brand-gold transition-colors" />
                  </div>
                  <span className="text-[11px] font-black text-brand-gold uppercase tracking-widest transition-colors">어드민 콘솔 (Nexus Admin)</span>
                </button>
              )}`;

if (s.includes(oldAdminBtn)) {
  s = s.replace(oldAdminBtn, newAdminBtn);
}

fs.writeFileSync(filePath, s, 'utf-8');
console.log('Successfully updated user-menu.tsx');
