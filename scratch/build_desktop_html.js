const fs = require('fs');
const path = require('path');

const publicDir = path.join('C:', 'Users', 'happy', 'OneDrive', '문서', '99. App_Dev', 'Directors_Areana', 'public');
const desktopFile = path.join('C:', 'Users', 'happy', 'OneDrive', '바탕 화면', 'Samiya_Platform_Intro.html');

console.log('Reading captured screenshots...');
const homeB64 = 'data:image/png;base64,' + fs.readFileSync(path.join(publicDir, 'screen_home.png')).toString('base64');
const wizardB64 = 'data:image/png;base64,' + fs.readFileSync(path.join(publicDir, 'screen_wizard.png')).toString('base64');
const adminB64 = 'data:image/png;base64,' + fs.readFileSync(path.join(publicDir, 'screen_admin.png')).toString('base64');

console.log('Generating standalone motion graphic HTML with embedded UI operation captures...');

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Samiya (사미야) - 실제 플랫폼 조작 모션 그래픽 쇼케이스</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800;900&family=Noto+Sans+KR:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #06060c;
      color: #ffffff;
      font-family: 'Plus Jakarta Sans', 'Noto Sans KR', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow-x: hidden;
      user-select: none;
    }

    .ambient-bg {
      position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
    }
    .glow-orb-1 {
      position: absolute; top: -150px; left: -150px; width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, transparent 70%);
      filter: blur(80px); animation: pulseOrb 8s infinite alternate ease-in-out;
    }
    .glow-orb-2 {
      position: absolute; bottom: -150px; right: -150px; width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, transparent 70%);
      filter: blur(80px); animation: pulseOrb 8s infinite alternate-reverse ease-in-out;
    }
    @keyframes pulseOrb {
      0% { transform: scale(1) translate(0, 0); }
      100% { transform: scale(1.15) translate(30px, 30px); }
    }

    .top-bar {
      width: 100%; max-width: 1120px; display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 12px; z-index: 10;
    }
    .brand-pill {
      display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1); padding: 6px 14px; border-radius: 9999px;
      font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #a5b4fc;
    }
    .server-link {
      font-size: 12px; font-weight: 800; color: #c5a059; background: rgba(197, 160, 89, 0.1);
      border: 1px solid rgba(197, 160, 89, 0.3); padding: 6px 14px; border-radius: 12px;
      text-decoration: none; transition: all 0.2s;
    }
    .server-link:hover {
      background: rgba(197, 160, 89, 0.2); transform: translateY(-1px);
    }

    .video-viewport {
      width: 100%; max-width: 1120px; aspect-ratio: 16 / 9;
      background: linear-gradient(135deg, #090814 0%, #040409 50%, #0e0a1c 100%);
      border-radius: 28px; border: 1px solid rgba(99, 102, 241, 0.35);
      box-shadow: 0 0 90px rgba(99, 102, 241, 0.25), 0 30px 60px rgba(0, 0, 0, 0.8);
      position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;
      z-index: 10;
    }

    .video-header {
      padding: 20px 28px; display: flex; align-items: center; justify-content: space-between; z-index: 20;
    }
    .video-chapter-tag {
      background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 5px 14px; border-radius: 9999px; font-size: 10px; font-family: monospace; font-weight: 700;
      color: #e2e8f0; display: flex; align-items: center; gap: 6px;
    }
    .live-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 8px #ef4444;
      animation: pingDot 1.5s infinite;
    }
    @keyframes pingDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }

    .stage {
      flex: 1; display: flex; align-items: center; justify-content: center; padding: 10px 30px;
      text-align: center; position: relative; z-index: 15; overflow: hidden;
    }
    .scene {
      display: none; flex-direction: column; align-items: center; justify-content: center; width: 100%;
      animation: sceneFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .scene.active { display: flex; }
    @keyframes sceneFadeIn {
      from { opacity: 0; transform: translateY(14px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* macOS Window Frame */
    .browser-window {
      width: 100%; max-width: 820px; background: #0b0a18; border-radius: 18px; border: 1px solid rgba(99, 102, 241, 0.4);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.2);
      overflow: hidden; text-align: left; position: relative;
    }
    .browser-titlebar {
      height: 36px; background: #131224; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0 14px; display: flex; align-items: center; justify-content: space-between;
    }
    .traffic-lights { display: flex; gap: 6px; }
    .traffic-lights span { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .traffic-red { background: #ff5f56; }
    .traffic-yellow { background: #ffbd2e; }
    .traffic-green { background: #27c93f; }
    .browser-url {
      background: rgba(0, 0, 0, 0.5); padding: 3px 18px; border-radius: 6px; font-size: 10px;
      font-family: monospace; color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex; align-items: center; gap: 6px;
    }
    .browser-viewport {
      position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; background: #000000;
    }
    .browser-viewport img {
      width: 100%; height: 100%; object-fit: cover; object-position: top center;
    }

    /* Animated Virtual Mouse Cursor */
    .virtual-cursor {
      position: absolute; z-index: 40; pointer-events: none;
      transition: all 0.9s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .cursor-icon {
      width: 28px; height: 28px; fill: #6366f1; stroke: #ffffff; stroke-width: 2;
      filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.9));
    }
    .click-shockwave {
      position: absolute; top: -10px; left: -10px; width: 44px; height: 44px;
      border-radius: 50%; border: 2px solid #fbbf24; background: rgba(251, 191, 36, 0.3);
      animation: shockwave 0.8s infinite ease-out;
    }
    @keyframes shockwave {
      0% { transform: scale(0.3); opacity: 1; }
      100% { transform: scale(1.6); opacity: 0; }
    }

    .ui-callout {
      position: absolute; bottom: 16px; left: 16px; right: 16px;
      background: rgba(10, 9, 22, 0.88); backdrop-filter: blur(16px);
      border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 14px;
      padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
    }

    /* Samiya Logo Vector Styles */
    .samiya-logo-wrap {
      display: inline-flex; align-items: center; font-size: 58px; font-weight: 900;
      letter-spacing: -0.03em; margin-bottom: 12px;
    }
    .logo-sam {
      background: linear-gradient(135deg, #a5b4fc 0%, #818cf8 50%, #c084fc 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .logo-i-wrap {
      position: relative; display: inline-flex; flex-direction: column; align-items: center;
      justify-content: flex-end; margin: 0 2px;
    }
    .logo-sparkles {
      position: absolute; top: -30px; width: 36px; height: 36px; pointer-events: none;
      animation: sparkPulse 2s infinite ease-in-out;
    }
    @keyframes sparkPulse {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px #c084fc); }
      50% { transform: scale(1.18); filter: drop-shadow(0 0 16px #818cf8); }
    }
    .logo-dot {
      width: 14px; height: 14px; border-radius: 50%; background: linear-gradient(135deg, #818cf8, #c084fc);
      box-shadow: 0 0 16px rgba(167, 139, 250, 0.9); margin-bottom: 5px;
    }
    .logo-stem {
      width: 10px; height: 38px; border-radius: 9999px; background: linear-gradient(180deg, #818cf8 0%, #6366f1 100%);
    }
    .logo-ya {
      background: linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #60a5fa 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* Video Player Controls */
    .video-controls {
      background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.85) 40%, rgba(0, 0, 0, 0.98) 100%);
      padding: 16px 24px 20px; z-index: 20;
    }
    .scrubber-bar {
      width: 100%; height: 6px; background: rgba(255, 255, 255, 0.15); border-radius: 9999px;
      cursor: pointer; position: relative; margin-bottom: 12px; overflow: hidden; transition: height 0.2s;
    }
    .scrubber-bar:hover { height: 8px; }
    .scrubber-progress {
      height: 100%; width: 0%; background: linear-gradient(90deg, #6366f1, #a855f7, #38bdf8);
      border-radius: 9999px; transition: width 0.08s linear;
    }
    .controls-row { display: flex; align-items: center; justify-content: space-between; }
    .controls-left, .controls-right { display: flex; align-items: center; gap: 10px; }
    .btn-circle {
      width: 34px; height: 34px; border-radius: 50%; background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15); color: #ffffff; display: flex;
      align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;
    }
    .btn-circle:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); }
    .btn-primary { background: #ffffff; color: #000000; border: none; }
    .time-badge { font-family: monospace; font-size: 11px; font-weight: 700; color: #94a3b8; }
    .chapter-pills { display: flex; align-items: center; gap: 6px; }
    .pill {
      background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 800; color: #94a3b8;
      cursor: pointer; transition: all 0.2s;
    }
    .pill:hover { background: rgba(255, 255, 255, 0.15); color: #ffffff; }
    .pill.active {
      background: #6366f1; color: #ffffff; border-color: #818cf8; box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
    }

    .cta-btn {
      display: inline-flex; align-items: center; gap: 8px; padding: 13px 26px; border-radius: 9999px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1); color: #ffffff; font-size: 13px;
      font-weight: 900; text-decoration: none; box-shadow: 0 0 35px rgba(99, 102, 241, 0.5);
      transition: all 0.2s; cursor: pointer; border: none;
    }
    .cta-btn:hover { transform: scale(1.05); filter: brightness(1.15); }
    .replay-btn {
      display: inline-flex; align-items: center; gap: 6px; padding: 12px 20px; border-radius: 9999px;
      background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s;
    }
  </style>
</head>
<body>
  <div class="ambient-bg">
    <div class="glow-orb-1"></div>
    <div class="glow-orb-2"></div>
  </div>

  <div class="top-bar">
    <div class="brand-pill">
      <span>✨ SAMIYA STUDIO LIVE DEMO</span>
    </div>
    <a href="http://localhost:3001" target="_blank" class="server-link">
      🚀 Samiya 실시간 웹 앱 접속하기 (localhost:3001)
    </a>
  </div>

  <div class="video-viewport" id="viewport">
    <div class="video-header">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:18px; font-weight:900; letter-spacing:-0.03em; color:#818cf8;">Samiya</span>
        <span style="font-size:10px; color:#64748b; font-weight:800; letter-spacing:0.2em;">• LIVE UI DEMO</span>
      </div>
      <div class="video-chapter-tag">
        <span class="live-dot"></span>
        <span id="chapterTag">01 영감의 불꽃 • Samiya 브랜드 인트로</span>
      </div>
    </div>

    <!-- Active Stage -->
    <div class="stage">
      
      <!-- ACT 0: THE SPARK (0s - 6s) -->
      <div class="scene active" id="scene0">
        <div class="samiya-logo-wrap">
          <span class="logo-sam">Sam</span>
          <div class="logo-i-wrap">
            <svg class="logo-sparkles" viewBox="0 0 40 40" fill="none">
              <line x1="12" y1="12" x2="6" y2="7" stroke="#818CF8" stroke-width="3" stroke-linecap="round"/>
              <line x1="16" y1="9" x2="14" y2="2" stroke="#A78BFA" stroke-width="3" stroke-linecap="round"/>
              <line x1="20" y1="8" x2="20" y2="1" stroke="#C084FC" stroke-width="3.5" stroke-linecap="round"/>
              <line x1="24" y1="9" x2="26" y2="2" stroke="#A78BFA" stroke-width="3" stroke-linecap="round"/>
              <line x1="28" y1="12" x2="34" y2="7" stroke="#818CF8" stroke-width="3" stroke-linecap="round"/>
            </svg>
            <div class="logo-dot"></div>
            <div class="logo-stem"></div>
          </div>
          <span class="logo-ya">ya</span>
        </div>
        <h2 style="font-size:26px; font-weight:900; margin-bottom:8px;">
          당신의 상상이 현실적인 스토리가 되는 곳
        </h2>
        <p style="font-size:13px; color:#94a3b8; line-height:1.6; max-width:540px;">
          원클릭 기획안 작성부터 8막 서사, 대본 집필, 프로덕션 분석까지<br>
          실제 서비스 조작 화면을 지금 바로 확인해보세요.
        </p>
      </div>

      <!-- ACT 1: HOME PAGE & POC LOGIN (6s - 14s) -->
      <div class="scene" id="scene1">
        <div class="browser-window">
          <div class="browser-titlebar">
            <div class="traffic-lights">
              <span class="traffic-red"></span>
              <span class="traffic-yellow"></span>
              <span class="traffic-green"></span>
            </div>
            <div class="browser-url">
              <span style="color:#34d399;">🔒</span>
              <span>https://samiya.studio</span>
            </div>
            <div style="font-size:10px; font-weight:700; color:#64748b;">1920 × 1080</div>
          </div>
          <div class="browser-viewport">
            <img src="${homeB64}" alt="Home Page Capture">
            <div class="virtual-cursor" id="cursor1" style="left:58%; top:72%;">
              <svg class="cursor-icon" viewBox="0 0 24 24">
                <path d="M3 3l7 18 3-7 7-3L3 3z"/>
              </svg>
              <div class="click-shockwave" id="shock1"></div>
            </div>
            <div class="ui-callout" style="border-color:rgba(251,191,36,0.5);">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="width:8px; height:8px; border-radius:50%; background:#fbbf24; display:inline-block;"></span>
                <span style="font-size:11px; font-weight:900; color:#fde047;">ONE-CLICK TEST ADMIN</span>
                <span style="font-size:11px; color:#cbd5e1;">— 로그인/비밀번호 없이 즉시 99,999 크레딧 계정으로 입장</span>
              </div>
              <span style="font-size:9px; font-family:monospace; background:#fbbf24; color:#000; padding:2px 8px; border-radius:4px; font-weight:900;">
                CLICK DETECTED
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ACT 2: WIZARD OPERATION (14s - 22s) -->
      <div class="scene" id="scene2">
        <div class="browser-window">
          <div class="browser-titlebar">
            <div class="traffic-lights">
              <span class="traffic-red"></span>
              <span class="traffic-yellow"></span>
              <span class="traffic-green"></span>
            </div>
            <div class="browser-url">
              <span style="color:#34d399;">🔒</span>
              <span>https://samiya.studio/project-wizard</span>
            </div>
            <div style="font-size:10px; font-weight:700; color:#818cf8;">STEP 1 / 4 • PRE-PRODUCTION</div>
          </div>
          <div class="browser-viewport">
            <img src="${wizardB64}" alt="Project Wizard Capture">
            <div class="virtual-cursor" id="cursor2" style="left:48%; top:65%;">
              <svg class="cursor-icon" viewBox="0 0 24 24">
                <path d="M3 3l7 18 3-7 7-3L3 3z"/>
              </svg>
            </div>
            <div class="ui-callout" style="border-color:rgba(99,102,241,0.5);">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; font-weight:900; color:#a5b4fc;">WIZARD INTERACTION</span>
                <span style="font-size:11px; color:#cbd5e1;">— 타겟 플랫폼 넷플릭스 & 8부작 회차 슬라이더 실시간 조작</span>
              </div>
              <span style="font-size:9px; font-family:monospace; background:#6366f1; color:#fff; padding:2px 8px; border-radius:4px; font-weight:900;">
                NETFLIX • 8 EPISODES
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ACT 3: SCRIPT STUDIO (22s - 30s) -->
      <div class="scene" id="scene3">
        <div class="browser-window">
          <div class="browser-titlebar">
            <div class="traffic-lights">
              <span class="traffic-red"></span>
              <span class="traffic-yellow"></span>
              <span class="traffic-green"></span>
            </div>
            <div class="browser-url">
              <span style="color:#34d399;">🔒</span>
              <span>https://samiya.studio/workspace/script-studio</span>
            </div>
            <div style="font-size:10px; font-weight:700; color:#34d399;">AI SHOWRUNNER CO-WRITER</div>
          </div>
          <div class="browser-viewport" style="background:#0d0c18; padding:24px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; margin-bottom:12px;">
                <span style="font-size:12px; font-weight:900; font-family:monospace; color:#818cf8;">S# 14. 근정전 앞마당 - 밤 (달빛 아래)</span>
                <span style="font-size:9px; font-family:monospace; background:rgba(52,211,153,0.2); color:#6ee7b7; padding:2px 8px; border-radius:9999px;">AI 대본 실시간 집필 중</span>
              </div>
              <div style="font-family:monospace; font-size:12px; color:#cbd5e1; line-height:1.7;">
                <p style="color:#64748b; margin-bottom:8px;">거친 비바람이 전각을 휘감는다. 붉은 도포를 입은 이도가 피 묻은 서신을 품에서 꺼낸다.</p>
                <p style="padding-left:14px; border-left:2px solid #6366f1; margin-bottom:6px;">
                  <strong style="color:#ffffff;">이도 (32)</strong><br>
                  "전하, 이 손에 쥐어진 것은 역모의 기록이 아니라, 전하께서 버리신 백성들의 눈물입니다."
                </p>
                <p style="padding-left:14px; border-left:2px solid #ef4444;">
                  <strong style="color:#ffffff;">한명회 (54)</strong><br>
                  "감히 누구 앞에서 세상을 논하느냐. 오늘 밤 궁을 나갈 수 있는 자는 없다."
                </p>
              </div>
            </div>
            <div class="ui-callout" style="position:static; margin-top:16px;">
              <span style="font-size:11px; color:#a5b4fc; font-weight:800;">⚡ 극적 긴장감 94.8% 달성 • 복선 자동 매칭 완료</span>
              <span style="font-size:9px; font-family:monospace; background:#10b981; color:#000; padding:2px 8px; border-radius:4px; font-weight:900;">READY</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ACT 4: ADMIN CONSOLE (30s - 35s) -->
      <div class="scene" id="scene4">
        <div class="browser-window">
          <div class="browser-titlebar">
            <div class="traffic-lights">
              <span class="traffic-red"></span>
              <span class="traffic-yellow"></span>
              <span class="traffic-green"></span>
            </div>
            <div class="browser-url">
              <span style="color:#fbbf24;">🛡️</span>
              <span>https://samiya.studio/admin</span>
            </div>
            <div style="font-size:10px; font-weight:700; color:#fbbf24;">NEXUS STRATEGIC CENTER</div>
          </div>
          <div class="browser-viewport">
            <img src="${adminB64}" alt="Admin Console Capture">
            <div class="ui-callout" style="border-color:rgba(251,191,36,0.5);">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; font-weight:900; color:#fbbf24;">NEXUS DASHBOARD</span>
                <span style="font-size:11px; color:#cbd5e1;">— 전체 회원 관리, 크레딧 사용량 및 AI 모델 실시간 관제</span>
              </div>
              <span style="font-size:9px; font-family:monospace; background:#fbbf24; color:#000; padding:2px 8px; border-radius:4px; font-weight:900;">
                LIVE TELEMETRY
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ACT 5: FINALE (35s - 40s) -->
      <div class="scene" id="scene5">
        <div class="samiya-logo-wrap" style="transform:scale(1.1); margin-bottom:14px;">
          <span class="logo-sam">Sam</span>
          <div class="logo-i-wrap">
            <svg class="logo-sparkles" viewBox="0 0 40 40" fill="none">
              <line x1="12" y1="12" x2="6" y2="7" stroke="#818CF8" stroke-width="3" stroke-linecap="round"/>
              <line x1="16" y1="9" x2="14" y2="2" stroke="#A78BFA" stroke-width="3" stroke-linecap="round"/>
              <line x1="20" y1="8" x2="20" y2="1" stroke="#C084FC" stroke-width="3.5" stroke-linecap="round"/>
              <line x1="24" y1="9" x2="26" y2="2" stroke="#A78BFA" stroke-width="3" stroke-linecap="round"/>
              <line x1="28" y1="12" x2="34" y2="7" stroke="#818CF8" stroke-width="3" stroke-linecap="round"/>
            </svg>
            <div class="logo-dot"></div>
            <div class="logo-stem"></div>
          </div>
          <span class="logo-ya">ya</span>
        </div>
        <h2 style="font-size:32px; font-weight:900; line-height:1.3; margin-bottom:12px;">
          지금, 당신의 이야기가<br>스크린 위에 펼쳐집니다
        </h2>
        <p style="font-size:13px; color:#94a3b8; margin-bottom:24px; max-width:480px; line-height:1.6;">
          한 줄의 아이디어에서 시작해 완성도 높은 대본까지.<br>
          Samiya AI 크리에이티브 스튜디오와 함께 시작하세요.
        </p>
        <div style="display:flex; align-items:center; gap:12px;">
          <a href="http://localhost:3001/project-wizard" target="_blank" class="cta-btn">
            ✨ 스토리 창작 시작하기
          </a>
          <button class="replay-btn" onclick="seekTo(0)">
            🔄 다시 보기
          </button>
        </div>
      </div>

    </div>

    <!-- Controls -->
    <div class="video-controls">
      <div class="scrubber-bar" id="scrubber">
        <div class="scrubber-progress" id="progress"></div>
      </div>

      <div class="controls-row">
        <div class="controls-left">
          <button class="btn-circle btn-primary" id="playBtn" onclick="togglePlay()">▶</button>
          <button class="btn-circle" onclick="seekTo(0)" title="처음부터 재생">↺</button>
          <span class="time-badge" id="timecode">00:00 / 00:40</span>
        </div>

        <div class="chapter-pills">
          <button class="pill active" onclick="seekTo(0)">01 영감의 불꽃</button>
          <button class="pill" onclick="seekTo(6)">02 POC 로그인</button>
          <button class="pill" onclick="seekTo(14)">03 위저드 조작</button>
          <button class="pill" onclick="seekTo(22)">04 각본 에디터</button>
          <button class="pill" onclick="seekTo(30)">05 어드민 센터</button>
          <button class="pill" onclick="seekTo(35)">06 피날레</button>
        </div>

        <div class="controls-right">
          <button class="btn-circle" id="soundBtn" onclick="toggleSound()">🔊</button>
          <button class="btn-circle" onclick="toggleFullscreen()">⛶</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const TOTAL_DURATION = 40;
    let currentTime = 0;
    let isPlaying = true;
    let isMuted = false;
    let lastTime = performance.now();

    const CHAPTERS = [
      { id: 0, time: 0, title: "01 영감의 불꽃 • Samiya 브랜드 인트로" },
      { id: 1, time: 6, title: "02 원클릭 POC 접속 • 메인 홈 & 1초 로그인" },
      { id: 2, time: 14, title: "03 위저드 실시간 조작 • 넷플릭스 8회차 기획" },
      { id: 3, time: 22, title: "04 대본 & 씬 에디터 • 쇼러너 AI 실시간 각본" },
      { id: 4, time: 30, title: "05 어드민 콘솔 대시보드 • 전략 인텔리전스 센터" },
      { id: 5, time: 35, title: "06 스튜디오 피날레 • 지금 스토리 창작 시작" }
    ];

    let currentAct = 0;
    let audioCtx = null;

    function playAudio(type) {
      if (isMuted) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        if (type === 'click') {
          osc.type = 'sine'; osc.frequency.setValueAtTime(1200, now); osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
          gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now + 0.05);
        } else if (type === 'whoosh') {
          osc.type = 'triangle'; osc.frequency.setValueAtTime(180, now); osc.frequency.exponentialRampToValueAtTime(450, now + 0.3);
          gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now + 0.35);
        } else if (type === 'spark') {
          osc.type = 'sine'; osc.frequency.setValueAtTime(320, now); osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
          gain.gain.setValueAtTime(0.12, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now + 0.4);
        }
      } catch(e) {}
    }

    document.getElementById('scrubber').addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      seekTo(ratio * TOTAL_DURATION);
    });

    function seekTo(t) {
      currentTime = Math.max(0, Math.min(TOTAL_DURATION, t));
      isPlaying = true;
      document.getElementById('playBtn').innerText = '❚❚';
    }

    function togglePlay() {
      isPlaying = !isPlaying;
      document.getElementById('playBtn').innerText = isPlaying ? '❚❚' : '▶';
    }

    function toggleSound() {
      isMuted = !isMuted;
      document.getElementById('soundBtn').innerText = isMuted ? '🔇' : '🔊';
    }

    function toggleFullscreen() {
      const el = document.getElementById('viewport');
      if (!document.fullscreenElement) {
        el.requestFullscreen().catch(()=>{});
      } else {
        document.exitFullscreen().catch(()=>{});
      }
    }

    function formatTime(s) {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return \`\${String(m).padStart(2,'0')}:\${String(sec).padStart(2,'0')}\`;
    }

    function loop(now) {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        currentTime += delta;
        if (currentTime >= TOTAL_DURATION) {
          currentTime = TOTAL_DURATION;
          isPlaying = false;
          document.getElementById('playBtn').innerText = '▶';
        }
      }

      const pct = (currentTime / TOTAL_DURATION) * 100;
      document.getElementById('progress').style.width = pct + '%';
      document.getElementById('timecode').innerText = \`\${formatTime(currentTime)} / \${formatTime(TOTAL_DURATION)}\`;

      let act = 0;
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        if (currentTime >= CHAPTERS[i].time) {
          act = i;
          break;
        }
      }

      if (act !== currentAct) {
        currentAct = act;
        document.getElementById('chapterTag').innerText = CHAPTERS[act].title;
        playAudio(act === 1 || act === 2 ? 'click' : 'whoosh');

        for (let i = 0; i < 6; i++) {
          const sc = document.getElementById('scene' + i);
          if (sc) sc.classList.toggle('active', i === act);
        }

        const pills = document.querySelectorAll('.pill');
        pills.forEach((p, idx) => p.classList.toggle('active', idx === act));
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  </script>
</body>
</html>`;

fs.writeFileSync(desktopFile, html, 'utf-8');
console.log('Successfully written desktop standalone file with embedded captures! Size:', fs.statSync(desktopFile).size);
